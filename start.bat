@echo off
chcp 65001 >nul
echo 🍸 Starting Mood Bar project...

REM Check if Node.js is installed
where node >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed, please install Node.js first
    pause
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed, please install Node.js first
    pause
    exit /b 1
)

REM Start backend server
echo 🚀 Starting backend server (port 3007)...
cd server
call npm install 2>nul || echo ⚠️  Backend dependencies installation failed, continuing...
start "Mood Bar Backend" cmd /c "npm run dev"
cd ..

REM Wait for backend to start
echo ⏳ Waiting for backend to start...
timeout /t 3 /nobreak >nul

REM Start frontend server
echo 🚀 Starting frontend development server (port 5173)...
cd app
call npm install 2>nul || echo ⚠️  Frontend dependencies installation failed, continuing...
start "Mood Bar Frontend" cmd /c "npm run dev"
cd ..

echo ✅ Startup completed!
echo.
echo 📊 Service status:
echo    Backend: http://localhost:3007
echo    Frontend: http://localhost:5173
echo    Backend health check: http://localhost:3007/health
echo.
echo 🛑 Press any key to stop this script (note: this will not stop the services, you need to close terminal windows manually)
pause >nul