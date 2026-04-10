@echo off
echo Simple Mood Bar Launcher
echo ========================

REM Change to the directory where this script is located
cd /d "%~dp0"

echo Current directory: %CD%
echo.

REM Check Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found.
    pause
    exit /b 1
)

echo Node.js found: checking version...
node --version
echo.

REM Start backend
echo Starting backend server...
if exist server\package.json (
    echo Found server\package.json
    cd server
    echo Installing dependencies if needed...
    if not exist node_modules (
        call npm install
    )
    echo Starting server with: npm run dev
    echo.
    echo ========= BACKEND OUTPUT =========
    call npm run dev
    cd ..
) else (
    echo ERROR: server\package.json not found
    pause
    exit /b 1
)

echo.
echo Backend terminated.
pause