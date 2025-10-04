#!/bin/bash

# Hostinger Deployment Script for Velvet Scalpel
# Run this script on your Hostinger server after cloning the repository

echo "🔮 Starting Velvet Scalpel deployment on Hostinger..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please enable Node.js in your Hostinger control panel."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please check your Node.js installation."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp .env.example .env
    echo "📝 Please edit .env file and add your OPENAI_API_KEY"
    echo "   You can edit it using: nano .env"
    echo ""
    echo "Required variables:"
    echo "   OPENAI_API_KEY=your_openai_api_key_here"
    echo "   PORT=3000"
    echo "   NODE_ENV=production"
    echo ""
    read -p "Press Enter after editing .env file..."
fi

# Test the application
echo "🧪 Testing application..."
timeout 5s npm start &
sleep 3
if pgrep -f "node server.js" > /dev/null; then
    echo "✅ Application started successfully!"
    pkill -f "node server.js"
else
    echo "❌ Application failed to start. Please check your configuration."
    exit 1
fi

echo ""
echo "🚀 Deployment complete!"
echo ""
echo "To start your application:"
echo "   npm start"
echo ""
echo "To run in background (recommended for production):"
echo "   nohup npm start > velvet-scalpel.log 2>&1 &"
echo ""
echo "To stop background process:"
echo "   pkill -f 'node server.js'"
echo ""
echo "Access your application at: http://yourdomain.com:3000"
echo "🔮✨ Velvet Scalpel is ready for mystical conversations!"