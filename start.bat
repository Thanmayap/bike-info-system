@echo off
echo Starting Bike Information System...
start cmd /k "cd backend && npm.cmd run dev"
start cmd /k "cd frontend && npm.cmd run dev"
echo.
echo Launching website in browser...
timeout /t 3 /nobreak >nul
start http://localhost:5173
echo.
echo Both servers have been started in separate windows.
echo You can open the website anytime at: http://localhost:5173
pause
