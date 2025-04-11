@echo off
echo Cleaning up any previous server processes...
taskkill /F /IM node.exe /T 2>nul

echo Building TypeScript...
call npm run build

echo Cleaning and seeding database...
call npm run seed

echo Starting server in production mode...
set NODE_ENV=production
start /B node --max-old-space-size=2048 dist/index.js > server.log 2>&1

echo Server started and logging to server.log
echo To stop the server, use Task Manager to end the node.exe process

start http://localhost:3000/ 