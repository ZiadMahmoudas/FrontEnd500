@echo off
setlocal
cd /d "%~dp0"
if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 goto :error
)
echo Starting Elmohager Next.js frontend...
call npm run dev
exit /b 0
:error
echo.
echo Failed to start the frontend. Make sure Node.js 22 is installed.
pause
exit /b 1
