@echo off
REM Habit Tracker - Schnellstart Datei
REM ===================================

cls
echo.
echo   ╔════════════════════════════════════╗
echo   ║     🎯 Habit Tracker Launcher      ║
echo   ╚════════════════════════════════════╝
echo.

cd /d "c:\Users\benib\Documents\Programmieren\Vibe_coding\Bucketlist_with_CoPilot\habit-tracker"

if not exist node_modules (
    echo [INFO] Installiere Dependencies...
    set PATH=E:;%PATH%
    E:\npm.cmd install
    echo.
)

echo [INFO] Starte Entwicklungs-Server...
set PATH=E:;%PATH%
E:\npm.cmd run dev

pause
