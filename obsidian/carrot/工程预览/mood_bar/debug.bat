@echo off
echo Debug Mood Bar Startup
echo ======================

cd /d "%~dp0"
echo Script directory: %~dp0
echo Current directory: %CD%
echo.

REM Test path access
echo Testing path access...
if exist server (
    echo server directory: OK
) else (
    echo server directory: NOT FOUND
)

if exist server\package.json (
    echo server\package.json: OK
) else (
    echo server\package.json: NOT FOUND
)

if exist app (
    echo app directory: OK
) else (
    echo app directory: NOT FOUND
)

echo.
echo Checking Node.js installation...
where node
if errorlevel 1 (
    echo ERROR: Node.js not in PATH
) else (
    for /f "tokens=*" %%i in ('where node') do echo Node found at: %%i
)

echo.
echo Checking npm...
where npm
if errorlevel 1 (
    echo ERROR: npm not in PATH
) else (
    for /f "tokens=*" %%i in ('where npm') do echo npm found at: %%i
)

echo.
echo Node.js version:
node --version

echo.
echo npm version:
npm --version

echo.
echo Testing server startup...
cd server
echo Running: node src/server.js
timeout /t 2 /nobreak >nul
node src/server.js
cd ..

echo.
echo Debug complete.
pause