import { app, BrowserWindow, desktopCapturer, session, ipcMain } from 'electron'
import * as child_process from 'child_process'
import 'dotenv/config'
import ffmpegPath from 'ffmpeg-static'
import * as fs from 'fs'
import * as path from 'path'

if (!ffmpegPath) {
  console.error("ffmpeg path is not defined. Make sure ffmpeg-static is installed correctly.")
  process.exit(1)
}

if (!fs.existsSync(ffmpegPath)) {
  console.error(`ffmpeg executable not found at: ${ffmpegPath}`)
  process.exit(1)
}

let ffmpegProcess: child_process.ChildProcessWithoutNullStreams | null = null
let ffmpegRestartTimeout: NodeJS.Timeout | null = null

function sendToRenderer(channel: string, data: any): void {
  const window = BrowserWindow.getAllWindows()[0]
  if (window) {
    window.webContents.send(channel, data)
  }
}

function startFFmpeg(rtmpUrl: string): void {
  if (ffmpegProcess) {
    console.warn("ffmpeg is already running, not starting another instance.")
    return
  }

  ffmpegProcess = child_process.spawn(ffmpegPath as string, [
    '-f', 'webm',
    '-i', 'pipe:0',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-g', '30',
    '-keyint_min', '30',
    '-an',
    '-f', 'flv',
    rtmpUrl
  ])

  sendToRenderer('rtmp-status', 'Connected')

  ffmpegProcess.stderr.on('data', (data) => {
    console.log('ffmpeg stderr:', data.toString())
  })

  ffmpegProcess.stdin.on('error', (err) => {
    console.error('ffmpeg STDIN error:', err)

    if (ffmpegRestartTimeout) {
      clearTimeout(ffmpegRestartTimeout)
    }

    ffmpegRestartTimeout = setTimeout(() => {
      console.log("Restarting ffmpeg due to stdin error...")
      startFFmpeg(rtmpUrl)
    }, 5000)
  })

  ffmpegProcess.on('close', () => {
    sendToRenderer('rtmp-status', `Closed, Waiting to start`)

    ffmpegProcess = null

    if (ffmpegRestartTimeout) {
      clearTimeout(ffmpegRestartTimeout)
    }
  })
}


function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  session.defaultSession.setDisplayMediaRequestHandler((_request, callback) => {
    desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
      callback({ video: sources[0], audio: 'loopback' })
    })
  }, { useSystemPicker: true })

  mainWindow.loadFile(path.join(__dirname, "../index.html"))
  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('video-data', (_event, chunk: Buffer) => {
  if (ffmpegProcess && !ffmpegProcess.stdin.destroyed) {
    ffmpegProcess.stdin.write(chunk)
  }
})

ipcMain.on('start-stream', (_event, rtmpUrl: string) => {
  if (!rtmpUrl) {
    console.error("RTMP URL is empty. Cannot start stream.")
    sendToRenderer('stream-interrupted', 'RTMP URL is empty. Cannot start stream.')
    return
  }
  startFFmpeg(rtmpUrl)
})


ipcMain.on('stop-stream', () => {
  console.log("Stopping ffmpeg process...")
  if (ffmpegProcess) {
    ffmpegProcess.kill()
    sendToRenderer('rtmp-status', 'Waiting to start')
  }
})
