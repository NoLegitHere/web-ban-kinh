@echo off
echo === Vietnamese Glasses Store - Development Environment Setup ===
echo.

echo === Updating Git Repository ===
git pull
echo.

echo === Updating Backend Dependencies ===
cd backend
call npm install
echo.

echo === Updating Frontend Dependencies ===
cd ..\frontend
call npm install
echo.

echo === Environment Setup Complete ===
echo.
echo To start the backend server: cd backend && .\start-server.bat
echo To start the frontend server: cd frontend && npm run dev
echo.
cd ..

echo === Current Git Branch ===
git branch --show-current
echo. 