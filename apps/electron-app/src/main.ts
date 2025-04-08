import { app, BrowserWindow, desktopCapturer, session, ipcMain } from 'electron';
import * as child_process from 'child_process';
import 'dotenv/config';
import ffmpegPath from 'ffmpeg-static';
import * as fs from 'fs';
import * as path from 'path';


if(!ffmpegPath) {
  console.error("ffmpeg path is not defined. Make sure ffmpeg-static is installed correctly.");
  process.exit(1);
}

// Verify that the file exists
if (!fs.existsSync(ffmpegPath)) {
  console.error(`ffmpeg executable not found at: ${ffmpegPath}`);
  process.exit(1);
} 
let ffmpegProcess: child_process.ChildProcessWithoutNullStreams | null = null;

function startFFmpeg(rtmpUrl: string): void {
  ffmpegProcess = child_process.spawn(ffmpegPath as string, [
    '-re',
    '-f', 'webm',
    '-i', 'pipe:0',
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-tune', 'zerolatency',
    '-f', 'flv',
    rtmpUrl
  ]);

  console.log("ffmpeg process started with PID:", ffmpegProcess.pid);

  ffmpegProcess.stderr.on('data', (data) => {
    console.log('ffmpeg stderr:', data.toString());
  });

  ffmpegProcess.stdin.on('error', (err) => {
    console.error('ffmpeg STDIN error:', err);
  });

  ffmpegProcess.on('close', (code) => {
    console.log(`ffmpeg process closed with code ${code}`);
  });
}

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  session.defaultSession.setDisplayMediaRequestHandler((_request, callback) => {
    desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
      callback({ video: sources[0], audio: 'loopback' });
    });
  }, { useSystemPicker: true });

  mainWindow.loadFile(path.join(__dirname, "../index.html"));
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
  const { RTMP_URL } = process.env;
  if (!RTMP_URL) {
    console.error("Missing RTMP_URL environment variable.");
  } else {
    startFFmpeg(RTMP_URL);
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('video-data', (_event, chunk: Buffer) => {
  if (ffmpegProcess && !ffmpegProcess.stdin.destroyed) {
    ffmpegProcess.stdin.write(chunk);
  }
});
