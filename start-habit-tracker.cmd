@echo off
REM Habit Tracker - Schnellstart Datei
REM ===================================

cls
echo.
echo   ╔════════════════════════════════════╗
echo   ║     🎯 Habit Tracker Launcher      ║
echo   ╚════════════════════════════════════╝
echo.

cd /d "%~dp0"

if not exist node_modules (
    echo [INFO] Installiere Dependencies...
    call npm install
    echo.
)

echo [INFO] Starte Entwicklungs-Server...
echo [INFO] Oeffnet sich automatisch im Browser auf http://localhost:5173
echo.
call npm run dev

pause
