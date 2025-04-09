@echo off
echo 🐳 Starting docker-compose...
start cmd /c "docker-compose up --build --remove-orphans"

echo ⏳ Waiting for backend...
:waitloop
timeout /t 1 >nul
curl http://localhost:4000/health >nul 2>&1
if errorlevel 1 goto waitloop
echo ✅ Backend ready!

echo 🚀 Starting Electron app...
cd apps\electron-app
call npm install
call npm start
