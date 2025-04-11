# 🧠 Informator Monorepo

A full-stack monorepo using Electron, Next.js, NestJS, and RTMP streaming powered by Docker.

---

## 🚀 How to Run the Application (Prod Mode)

This project uses Docker for backend services (NestJS, Next.js, nginx-rtmp) and runs the Electron desktop app **natively on your system**.

### ✅ Step-by-Step Instructions

### 🖥️ For Unix/Linux/macOS:

```bash
./start.sh
```

This script will:
1. Start the `docker-compose` services
2. Wait for the NestJS backend to become available (`http://localhost:4000/health`)
3. Install and start the Electron app (`apps/electron-app`) on your host

> Make sure to make the script executable first:
> ```bash
> chmod +x start.sh
> ```

---

### 🪟 For Windows (CMD/PowerShell):

Use the batch script:

```cmd
start.bat
```

This will:
1. Start Docker services in a new window
2. Wait until the backend is up
3. Launch the Electron app using native Node.js

> Alternatively, you can use `Git Bash` and run the same `./start.sh` script from Unix section.

---

## 📦 Prerequisites

Ensure the following are installed **before you run the scripts**:

| Tool            | Version             | Required For           |
|-----------------|---------------------|------------------------|
| **Docker**       | Latest              | Backend containerization |
| **Docker Compose** | v2+                 | Service orchestration |
| **Node.js**      | **v20 or later**    | Electron app runtime |
| **npm**          | Bundled with Node   | Package management |
| **curl**         | Any version         | Used in startup script for backend health checks |

---

## 📁 Project Structure

```
monorepo-root/
├── apps/
│   ├── electron-app/     # Desktop application
│   ├── nest-backend/     # Backend API (NestJS)
│   └── next-app/         # Frontend (Next.js)
├── nginx/                # RTMP server configuration
├── docker-compose.yml    # Service configuration
├── start.sh             # Dev startup script (Unix/macOS/Linux)
├── start.bat         # Dev startup script (Windows)
└── README.md
```

---

## 🛠 Troubleshooting

### ❓ Electron App Doesn’t Start?

Ensure you're running it **outside Docker** — Electron requires GUI access and won't work in a headless container without extra setup (e.g., Xvfb).

### ❓ Backend not reachable?

Make sure port `4000` is not blocked or already in use. The Electron app will only start once `http://localhost:4000/health` responds successfully.

---

## 🧼 Cleaning Up

To stop all services and clean up:

```bash
docker-compose down --volumes --remove-orphans
```

---

## 👨‍💻 Maintained By

**Gord1y**

---