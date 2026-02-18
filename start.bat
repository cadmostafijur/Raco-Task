@echo off
cd /d "D:\Raco Task"
echo Starting Backend and Frontend...
start "Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "Frontend" cmd /k "cd frontend && npm run dev"
echo.
echo Backend: http://localhost:4000
echo Frontend: http://localhost:3000
echo.
pause
