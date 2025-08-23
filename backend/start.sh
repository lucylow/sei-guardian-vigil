#!/bin/bash

# SEI Sentinel Backend Startup Script

echo "🚀 Starting SEI Sentinel Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from example..."
    if [ -f "env.example" ]; then
        cp env.example .env
        echo "✅ Created .env file from example"
        echo "⚠️  Please edit .env file with your configuration before starting"
        echo "   Required: SEI_MCP_URL, AGENT_NFT_CONTRACT"
        exit 1
    else
        echo "❌ No env.example file found. Please create .env manually"
        exit 1
    fi
fi

# Check required environment variables
source .env
if [ -z "$SEI_MCP_URL" ] || [ -z "$AGENT_NFT_CONTRACT" ]; then
    echo "❌ Missing required environment variables in .env file:"
    echo "   - SEI_MCP_URL"
    echo "   - AGENT_NFT_CONTRACT"
    echo "Please update your .env file and try again."
    exit 1
fi

echo "✅ Environment configuration looks good"

# Build the project
echo "🔨 Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"

# Start the server
echo "🚀 Starting server on port ${PORT:-4000}..."
echo "📡 Backend will be available at: http://localhost:${PORT:-4000}"
echo "🔗 API endpoints:"
echo "   - Agent Management: /api/agents/*"
echo "   - Sei Integration: /api/sei/*"
echo "   - System Status: /api/status"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
