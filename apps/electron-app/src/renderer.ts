import { ipcRenderer } from 'electron'

const streamKeyInput = document.getElementById('streamKeyInput') as HTMLInputElement
const startButton = document.getElementById('startButton') as HTMLButtonElement
const stopButton = document.getElementById('stopButton') as HTMLButtonElement
const previewVideo = document.getElementById('previewVideo') as HTMLVideoElement
const wsStatusElem = document.getElementById('wsStatus') as HTMLElement
const rtmpStatusElem = document.getElementById('rtmpStatus') as HTMLElement
const setupDiv = document.getElementById('setupDiv') as HTMLDivElement
const streamControls = document.getElementById('streamControls') as HTMLDivElement

let socket: WebSocket | null = null
let localStream: MediaStream | null = null
let mediaRecorder: MediaRecorder | null = null
let streamKey = ""

function updateWSStatus(status: string) {
  wsStatusElem.innerText = status
}

function updateRTMPStatus(status: string) {
  rtmpStatusElem.innerText = status
}

const { SOCKET_URL, RTMP_URL } = process.env
if (!SOCKET_URL || !RTMP_URL) {
  updateWSStatus("Error: Missing environment variables.")
  throw new Error('Missing required environment variables.')
}

function connectAndAuthenticate(): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    if (!SOCKET_URL) {
      reject(new Error('SOCKET_URL is not defined'))
      return
    }
    const ws = new WebSocket(SOCKET_URL)
    updateWSStatus("Connecting...")
    ws.addEventListener('open', () => {
      updateWSStatus("Connected")
      ws.send(JSON.stringify({ type: 'authenticate', payload: streamKey }))
    })
    const authTimeout = setTimeout(() => {
      ws.removeEventListener('message', handleAuthMessage)
      ws.close()
      reject(new Error('Authentication timeout'))
    }, 5000)
    const authCloseHandler = () => {
      if (ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket closed before authentication'))
      }
    }
    ws.addEventListener('close', authCloseHandler)
    const handleAuthMessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.type === 'error') {
          clearTimeout(authTimeout)
          updateWSStatus("Authentication error: " + msg.payload.message)
          ws.close()
          ws.removeEventListener('message', handleAuthMessage)
          ws.removeEventListener('close', authCloseHandler)
          reject(new Error(msg.payload.message))
        } else if (msg.type === 'authenticated') {
          clearTimeout(authTimeout)
          ws.removeEventListener('message', handleAuthMessage)
          ws.removeEventListener('close', authCloseHandler)
          ws.addEventListener('message', (event: MessageEvent) => {
            const message = JSON.parse(event.data)
            if (message.type === 'error') {
              console.error('Error from server:', message)
              wsErrorHandler()
            } else {
              console.log('Received message:', message)
            }
          })
          resolve(ws)
        }
      } catch (e) {
        console.error("Error handling auth message", e)
      }
    }
    ws.addEventListener('message', handleAuthMessage)
    ws.addEventListener('error', () => {
      updateWSStatus("WebSocket error")
      reject(new Error("WebSocket error"))
    })
  })
}

async function wsErrorHandler() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop()
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  ipcRenderer.send('stop-stream')
  stopStreamingUI()
  if (socket) {
    socket.close()
  }
  socket = null
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop())
    localStream = null
  }
  previewVideo.pause()
}

streamKeyInput.addEventListener('input', () => {
  streamKey = streamKeyInput.value.trim()
  if (streamKey !== "") {
    startButton.style.display = "inline-block"
  } else {
    startButton.style.display = "none"
  }
})

function startStreamingUI() {
  setupDiv.style.display = "none"
  streamControls.style.display = "flex"
}

function stopStreamingUI() {
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop())
    localStream = null
  }
  previewVideo.pause()
  previewVideo.srcObject = null
  setupDiv.style.display = "flex"
  streamControls.style.display = "none"
}

ipcRenderer.on('rtmp-status', (_event, status: string) => {
  updateRTMPStatus(status)
})

ipcRenderer.on('stream-interrupted', (_event, data: { type: string; message: string }) => {
  console.error(`Stream interrupted due to ${data.type} issue:`, data.message)
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop()
  }
  stopStreamingUI()
  if (data.type === 'rtmp' && socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'stopStream' }))
    socket.close()
  }
})

async function startStreaming() {
  try {
    socket = await connectAndAuthenticate()
    socket.addEventListener('close', () => {
      updateWSStatus("WebSocket connection closed. Stopping stream.")
      wsErrorHandler()
    })
  } catch (error: any) {
    console.error('Authentication failed', error)
    updateWSStatus("Authentication error: " + error.message)
    return
  }
  const finalRTMPUrl = RTMP_URL + streamKey
  try {
    localStream = await navigator.mediaDevices.getDisplayMedia({
      video: { width: 1920, height: 1080, frameRate: 30, facingMode: 'user' },
      audio: false
    })
    previewVideo.srcObject = localStream
    previewVideo.onloadedmetadata = () => previewVideo.play()
    ipcRenderer.send('start-stream', finalRTMPUrl)
    mediaRecorder = new MediaRecorder(localStream, { mimeType: 'video/webm; codecs=vp8' })
    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data && event.data.size > 0) {
        const reader = new FileReader()
        reader.onload = function () {
          if (reader.result instanceof ArrayBuffer) {
            ipcRenderer.send('video-data', Buffer.from(reader.result))
          }
        }
        reader.readAsArrayBuffer(event.data)
      }
    }
    mediaRecorder.onstart = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'startStream' }))
      }
    }
    mediaRecorder.onstop = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'stopStream' }))
      }
      stopStreamingUI()
    }
    mediaRecorder.start(1000)
    startStreamingUI()
  } catch (error) {
    console.error('Error starting stream:', error)
  }
}

startButton.addEventListener('click', () => {
  startStreaming()
})

stopButton.addEventListener('click', () => {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop()
  }
  ipcRenderer.send('stop-stream')
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'stopStream' }))
  }
  stopStreamingUI()
})
