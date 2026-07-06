@echo off
echo ==========================================
echo  MMMUT Hostel Exchange Portal - Setup
echo ==========================================
echo.

echo [1/3] Installing Backend dependencies...
cd /d "%~dp0backend"
npm install
echo.

echo [2/3] Installing Frontend dependencies...
cd /d "%~dp0frontend"
npm install
echo.

echo ==========================================
echo  Setup Complete!
echo ==========================================
echo.
echo IMPORTANT: Before starting, edit backend\.env
echo and add your MongoDB Atlas connection string!
echo.
echo To start the app:
echo   1. Open a terminal in 'backend' folder and run: npm run dev
echo   2. Open a terminal in 'frontend' folder and run: npm run dev
echo   3. Visit http://localhost:3000 in your browser
echo.
pause
