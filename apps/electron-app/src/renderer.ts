import { ipcRenderer } from 'electron';

const startButton = document.getElementById('startButton') as HTMLButtonElement;
const stopButton = document.getElementById('stopButton') as HTMLButtonElement;
const video = document.querySelector('video') as HTMLVideoElement;

const { SOCKET_URL, SOCKET_API_KEY } = process.env;
if (!SOCKET_URL || !SOCKET_API_KEY) {
  throw new Error('Missing required environment variables.');
}

let socket: WebSocket;
let localStream: MediaStream | null = null;
let mediaRecorder: MediaRecorder | null = null;

const connectWebSocket = () => {
  socket = new WebSocket(SOCKET_URL);
  video.srcObject = null;
  video.pause();

  socket.addEventListener('open', () => {
    console.log('WebSocket connection established');
    socket.send(JSON.stringify({ type: 'authenticate', payload: SOCKET_API_KEY }));
  });

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    switch (message.type) {
      case 'error': {
        console.error('Error from server:', message.payload.message);
        break;
      }
      default:
        console.log('Received unknown message:', message);
    }
  });

  socket.addEventListener('close', () => {
    if (localStream) alert('WebSocket disconnected. Attempting to reconnect...');
    console.error('WebSocket connection closed. Attempting to reconnect...');
    setTimeout(connectWebSocket, 3000);
  });
};

connectWebSocket();

startButton.addEventListener('click', async () => {
  try {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      alert('WebSocket is not open. Cannot start stream.');
      return;
    }
    localStream = await navigator.mediaDevices.getDisplayMedia({
      video: { width: 1280, height: 720, frameRate: 30 },
      audio: false
    });
    video.srcObject = localStream;
    video.onloadedmetadata = () => video.play();

    
    mediaRecorder = new MediaRecorder(localStream, { mimeType: 'video/webm; codecs=vp8' });

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data && event.data.size > 0) {
        const reader = new FileReader();
        reader.onload = function () {
          if (reader.result instanceof ArrayBuffer) {
            ipcRenderer.send('video-data', Buffer.from(reader.result));
          }
        };
        reader.readAsArrayBuffer(event.data);
      }
    };

    mediaRecorder.onstart = () => {
      console.log("MediaRecorder started, streaming is live.");
      socket.send(JSON.stringify({ type: 'startStream' }));
    };

    mediaRecorder.start(1000);
  } catch (error) {
    console.error('Error starting stream:', error);
  }
});

stopButton.addEventListener('click', () => {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
  video.pause();
  video.srcObject = null;
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
    localStream = null;
  }
  socket.send(JSON.stringify({ type: 'stopStream' }));
  console.log('Streaming stopped.');
});
