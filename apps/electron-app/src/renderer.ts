import { ipcRenderer } from 'electron'

const streamKeyInput = document.getElementById('streamKeyInput') as HTMLInputElement
const startButton = document.getElementById('startButton') as HTMLButtonElement
const stopButton = document.getElementById('stopButton') as HTMLButtonElement
const previewVideo = document.getElementById('previewVideo') as HTMLVideoElement
const wsStatusElem = document.getElementById('wsStatus') as HTMLElement
const rtmpStatusElem = document.getElementById('rtmpStatus') as HTMLElement
const setupDiv = document.getElementById('setupDiv') as HTMLDivElement
const streamControls = document.getElementById('streamControls') as HTMLDivElement


let socket: WebSocket
let localStream: MediaStream | null = null
let mediaRecorder: MediaRecorder | null = null
let streamKey = ""

function updateWSStatus(status: string) {
  wsStatusElem.innerText = status
}

function updateRTMPStatus(status: string) {
  rtmpStatusElem.innerText = status
}

const { SOCKET_URL, SOCKET_API_KEY, RTMP_URL } = process.env
if (!SOCKET_URL || !SOCKET_API_KEY || !RTMP_URL) {
  updateWSStatus("Error: Missing environment variables.")

  throw new Error('Missing required environment variables.')
}

function connectWebSocket() {
  if (!SOCKET_URL) {
    console.error('WebSocket URL is not defined. Cannot connect.')
    updateWSStatus("WebSocket URL not defined.")
    return
  }
  socket = new WebSocket(SOCKET_URL)
  updateWSStatus("Connecting...")

  socket.addEventListener('open', () => {
    updateWSStatus("Connected")
    socket.send(JSON.stringify({ type: 'authenticate', payload: SOCKET_API_KEY }))
  })

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    if (message.type === 'error') {
      console.error('Error from server:', message.payload.message)
    } else {
      console.log('Received message:', message)
    }
  })

  socket.addEventListener('close', () => {
    updateWSStatus("Disconnected")

    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop()
      stopStreamingUI()
    }
    setTimeout(connectWebSocket, 3000)
  })
}

connectWebSocket()


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
  }
})

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
    localStream.getTracks().forEach((track) => track.stop())
    localStream = null
  }
  previewVideo.pause()
  previewVideo.srcObject = null
  setupDiv.style.display = "flex"
  streamControls.style.display = "none"
}

async function startStreaming() {
  if (socket.readyState !== WebSocket.OPEN) {
    alert('WebSocket is not open. Cannot start stream.')
    return
  }
  const finalRTMPUrl = RTMP_URL + streamKey

  try {
    localStream = await navigator.mediaDevices.getDisplayMedia({
      video: { width: 1280, height: 720, frameRate: 30 },
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
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'startStream' }))
      }
    }

    mediaRecorder.onstop = () => {
      if (socket.readyState === WebSocket.OPEN) {
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
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'stopStream' }))
  }
  stopStreamingUI()
})
