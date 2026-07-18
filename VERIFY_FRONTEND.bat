@echo off
setlocal
cd /d "%~dp0"
if not exist node_modules (
  echo Installing dependencies...
  call npm ci
  if errorlevel 1 goto :error
)
echo Checking TypeScript...
call npm run lint
if errorlevel 1 goto :error
echo Building production version...
call npm run build
if errorlevel 1 goto :error
echo.
echo Frontend verification succeeded.
pause
exit /b 0
:error
echo.
echo Frontend verification failed. Review the error above.
pause
exit /b 1
