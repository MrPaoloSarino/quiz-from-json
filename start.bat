@echo off
REM ============================================================
REM  QuizMaster AI – Windows Launcher
REM  • Ensures dependencies are installed
REM  • Runs the npm "start" script (setup + dev server)
REM ============================================================

SETLOCAL ENABLEEXTENSIONS

:: Move to the directory where this script resides
pushd "%~dp0"

:: Pretty header
echo.
echo ======================================
echo   QuizMaster AI – Development Server
echo ======================================
echo.

:: Auto-install dependencies if node_modules is missing
IF NOT EXIST "node_modules" (
  echo [INFO] Installing npm dependencies. This may take a minute…
  npm install || (
    echo [ERROR] npm install failed. Press any key to exit.
    pause >nul
    popd
    ENDLOCAL
    exit /b 1
  )
)

:: Run the shortcut defined in package.json
echo [INFO] Starting development server (npm start)…
call npm start

:: Return to original directory when done
popd
ENDLOCAL 