@echo off
echo Starting Mood Bar project...

REM Check if Node.js is installed
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed. Please install Node.js first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if server directory exists
if not exist "server\" (
    echo ERROR: server directory not found!
    pause
    exit /b 1
)

REM Check if app directory exists
if not exist "app\" (
    echo WARNING: app directory not found. Frontend may not work.
)

echo Starting backend server (port 3002)...
cd server

REM Check package.json
if not exist "package.json" (
    echo ERROR: package.json not found in server directory!
    cd ..
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules\" (
    echo Installing backend dependencies...
    call npm install
    if errorlevel 1 (
        echo WARNING: Backend dependency installation failed.
    )
)

echo Running backend server...
start "Mood Bar Backend" cmd /k "npm run dev"
cd ..

echo Waiting for backend to start (3 seconds)...
timeout /t 3 /nobreak >nul

REM Start frontend if app directory exists
if exist "app\" (
    echo Starting frontend development server (port 5173)...
    cd app

    if not exist "package.json" (
        echo WARNING: package.json not found in app directory.
    ) else (
        if not exist "node_modules\" (
            echo Installing frontend dependencies...
            call npm install
            if errorlevel 1 (
                echo WARNING: Frontend dependency installation failed.
            )
        )

        echo Running frontend server...
        start "Mood Bar Frontend" cmd /k "npm run dev"
    )
    cd ..
) else (
    echo WARNING: Skipping frontend startup (app directory not found).
)

echo.
echo ========================================
echo SERVICE STATUS
echo ========================================
echo Backend API:      http://localhost:3002
echo Frontend App:     http://localhost:5173
echo Health Check:     http://localhost:3002/health
echo.
echo Backend console:  "Mood Bar Backend" window
echo Frontend console: "Mood Bar Frontend" window
echo ========================================
echo.
echo IMPORTANT: Keep these console windows open.
echo To stop servers, close the console windows.
echo.
echo Press any key to exit this launcher...
pause >nul