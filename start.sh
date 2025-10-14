#!/bin/bash

# Voting System Startup Script (Supabase + Next.js)

echo "🚀 Starting Voting System..."

# Function to check if a port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
    return $?
}

# Check if frontend port is available
if check_port 3000; then
    echo "❌ Port 3000 is already in use. Please stop the frontend service."
    exit 1
fi

# Install dependencies and start application
echo "📦 Installing dependencies..."
npm install > /dev/null 2>&1

# Check if .env.local exists, if not copy from env.example
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from env.example..."
    cp env.example .env.local
    echo "⚠️  Please edit .env.local with your Supabase credentials before using the app"
    echo "   You can find your credentials in your Supabase dashboard under Settings > API"
fi

echo "🌐 Starting application..."
npm run dev &
APP_PID=$!

echo ""
echo "✅ Voting System is now running!"
echo "🔗 Application: http://localhost:3000"
echo "🗄️  Backend: Supabase (cloud)"
echo ""
if [ ! -f ".env.local" ] || grep -q "your_supabase_project_url" .env.local; then
    echo "⚠️  IMPORTANT: Configure your Supabase credentials in .env.local"
    echo "   1. Go to https://supabase.com and create a project"
    echo "   2. Get your Project URL and anon key from Settings > API"
    echo "   3. Edit .env.local with your actual credentials"
    echo "   4. Run the SQL from supabase-schema.sql in your Supabase SQL Editor"
    echo ""
fi
echo "Press Ctrl+C to stop the service"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping service..."
    kill $APP_PID 2>/dev/null
    echo "✅ Service stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for the process
wait $APP_PID
