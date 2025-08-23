@echo off
REM SEI Sentinel Backend Startup Script for Windows

echo 🚀 Starting SEI Sentinel Backend...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  No .env file found. Creating from example...
    if exist "env.example" (
        copy env.example .env
        echo ✅ Created .env file from example
        echo ⚠️  Please edit .env file with your configuration before starting
        echo    Required: SEI_MCP_URL, AGENT_NFT_CONTRACT
        pause
        exit /b 1
    ) else (
        echo ❌ No env.example file found. Please create .env manually
        pause
        exit /b 1
    )
)

echo ✅ Environment configuration looks good

REM Build the project
echo 🔨 Building project...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Build successful

REM Start the server
echo 🚀 Starting server on port 4000...
echo 📡 Backend will be available at: http://localhost:4000
echo 🔗 API endpoints:
echo    - Agent Management: /api/agents/*
echo    - Sei Integration: /api/sei/*
echo    - System Status: /api/status
echo.
echo Press Ctrl+C to stop the server
echo.

npm start

pause
