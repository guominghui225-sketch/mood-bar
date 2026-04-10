@echo off
echo Mood Bar Backend Server
echo ======================
echo.
echo This will start the backend server in the current window.
echo All console logs (including prompt logs) will appear here.
echo.
echo Press Ctrl+C to stop the server.
echo.

REM Check if we're in the correct directory by looking for server directory
if not exist "server" (
    echo ERROR: 'server' directory not found in current location.
    echo.
    echo Please run this script from the main Mood Bar directory.
    echo Expected directory should contain: server/, app/, start.bat
    echo.
    echo Current directory:
    cd
    echo.
    pause
    exit /b 1
)

REM Check Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

echo Checking backend dependencies...
cd server

if not exist "package.json" (
    echo ERROR: package.json not found in server directory.
    cd ..
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo WARNING: Some dependencies may have failed to install.
    )
    echo.
)

echo =================================
echo STARTING MOOD BAR BACKEND SERVER
echo =================================
echo API: http://localhost:3002
echo Health: http://localhost:3002/health
echo.
echo ALL PROMPT LOGS WILL APPEAR BELOW
echo =================================
echo.

REM Run the server
npm run dev

echo.
echo Server stopped.
cd ..
pause