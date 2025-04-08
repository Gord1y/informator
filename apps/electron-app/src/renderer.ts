const startButton = document.getElementById('startButton') as HTMLButtonElement
const stopButton = document.getElementById('stopButton') as HTMLButtonElement
const video = document.querySelector('video') as HTMLVideoElement

const { SOCKET_URL, SOCKET_API_KEY } = process.env
if (!SOCKET_URL || !SOCKET_API_KEY) {
  throw new Error('Missing required environment variables.')
}

let socket: WebSocket
let localStream: MediaStream | null = null

const connectWebSocket = () => {
  socket = new WebSocket(SOCKET_URL)
  video.srcObject = null
  video.pause()

  socket.addEventListener('open', () => {
    console.log('WebSocket connection established')
    socket.send(JSON.stringify({ type: 'authenticate', payload: SOCKET_API_KEY }))
  })

  socket.addEventListener('message', async (event) => {
    const message = JSON.parse(event.data)
    switch (message.type) {
      case 'error': {
        console.error('Error from server:', message.payload.message)
        break
      }
      default:
        console.log('Received unknown message:', message)
    }
  })

  socket.addEventListener('close', () => {
    if(localStream) alert('WebSocket disconnected. Attempting to reconnect...')
    console.error('WebSocket connection closed. Attempting to reconnect...')
    setTimeout(connectWebSocket, 3000)
  })
}

connectWebSocket()

startButton.addEventListener('click', async () => {
  try {
    if(!socket || socket.readyState !== WebSocket.OPEN) {
      alert('WebSocket is not open. Cannot start stream.')
      return
    }
    // Get the display media stream (screen capture).
    localStream = await navigator.mediaDevices.getDisplayMedia({
      video: { width: 1280, height: 720, frameRate: 30 },
      audio: false,
    })
    video.srcObject = localStream
    video.onloadedmetadata = () => video.play()

    // Notify backend that streaming is starting.
    socket.send(JSON.stringify({ type: 'startStream' }))
    // Request creation of a producer transport.
    socket.send(JSON.stringify({ type: 'createProducerTransport' }))
    console.log('Stream started via mediasoup.')
  } catch (error) {
    console.error('Error starting stream:', error)
  }
})

stopButton.addEventListener('click', () => {
  video.pause()
  video.srcObject = null
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop())
    localStream = null
  }
  // Notify backend that streaming has stopped.
  socket.send(JSON.stringify({ type: 'stopStream' }))
  console.log('Streaming stopped.')
})
