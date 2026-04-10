@echo off
echo Mood Bar - Single Window Launcher
echo =================================

cd /d "%~dp0"
echo Working directory: %CD%
echo.

REM Check Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js:
node --version
echo.

REM Check server
if not exist server (
    echo ERROR: server directory not found.
    pause
    exit /b 1
)

cd server
if not exist package.json (
    echo ERROR: package.json not found in server.
    cd ..
    pause
    exit /b 1
)

echo Installing backend dependencies if needed...
if not exist node_modules (
    call npm install --no-fund --no-audit
    if errorlevel 1 (
        echo WARNING: Backend dependency installation had issues.
    )
)

echo.
echo ================================
echo STARTING BACKEND SERVER
echo ================================
echo Backend will run in THIS window.
echo Press Ctrl+C to stop the server.
echo.
echo API: http://localhost:3002
echo Health: http://localhost:3002/health
echo.
echo ALL CONSOLE LOGS (including prompt logs) will appear here.
echo.
echo ================================
echo.

REM Run backend
npm run dev

echo.
echo Backend server stopped.
cd ..
pause