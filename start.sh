#!/usr/bin/env bash

# === Cross-platform check ===
OS=$(uname | tr '[:upper:]' '[:lower:]')

# === Function: Wait for backend to be ready ===
wait_for_backend() {
  echo "⏳ Waiting for backend (http://localhost:4000)..."
  until curl -s http://localhost:4000/health >/dev/null; do
    sleep 1
  done
  echo "✅ Backend ready!"
}

# === Function: Start Electron App ===
start_electron() {
  echo "🚀 Starting Electron app..."
  cd apps/electron-app || exit 1

  if [ "$OS" == "mingw32" ] || [ "$OS" == "msys" ] || [ "$OS" == "windowsnt" ]; then
    # Windows Git Bash
    cmd.exe /c "npm install && npm start"
  else
    npm install
    npm start
  fi
}

# === Main ===
echo "🐳 Starting docker-compose stack..."
docker-compose up --build --remove-orphans &

DOCKER_PID=$!

# Wait for backend service to be healthy
wait_for_backend

# Start Electron outside Docker
start_electron

# Cleanup on exit
trap "echo '⛔ Stopping docker-compose...'; kill $DOCKER_PID" SIGINT SIGTERM
wait $DOCKER_PID
