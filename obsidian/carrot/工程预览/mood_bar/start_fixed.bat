@echo off
echo Mood Bar Launcher (Fixed)
echo =========================

REM Change to script directory
cd /d "%~dp0"
echo Working directory: %CD%
echo.

REM Check Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH.
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Function to start a service
call :start_service "backend" "server" "npm run dev" "http://localhost:3002"
call :start_service "frontend" "app" "npm run dev" "http://localhost:5173"

echo.
echo ================================
echo SERVICES STARTED
echo ================================
echo Backend:  http://localhost:3002
echo Frontend: http://localhost:5173
echo Health:   http://localhost:3002/health
echo.
echo Note: Console windows have been opened separately.
echo To stop services, close the console windows.
echo.
echo This launcher will exit in 5 seconds...
timeout /t 5 >nul
exit /b 0

REM Function to start a service in new window
:start_service
set service_name=%~1
set service_dir=%~2
set service_cmd=%~3
set service_url=%~4

echo.
echo Starting %service_name%...

if not exist "%service_dir%\" (
    echo WARNING: %service_dir% directory not found. Skipping %service_name%.
    exit /b 0
)

cd "%service_dir%"
if not exist "package.json" (
    echo ERROR: package.json not found in %service_dir%.
    cd ..
    exit /b 1
)

echo Directory: %CD%
echo Command: %service_cmd%

REM Install dependencies if needed
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install --no-fund --no-audit
    if errorlevel 1 (
        echo WARNING: Failed to install dependencies.
    )
)

REM Create a batch file to run the service
echo @echo off > run_%service_name%.bat
echo echo %service_name% Service >> run_%service_name%.bat
echo echo ================= >> run_%service_name%.bat
echo cd /d "%~dp0" >> run_%service_name%.bat
echo echo Working directory: %%CD%% >> run_%service_name%.bat
echo echo Starting: %service_cmd% >> run_%service_name%.bat
echo echo. >> run_%service_name%.bat
echo %service_cmd% >> run_%service_name%.bat
echo pause >> run_%service_name%.bat

REM Start in new window
start "%service_name% Service" cmd /k "run_%service_name%.bat"
cd ..

echo %service_name% started at %service_url%
exit /b 0