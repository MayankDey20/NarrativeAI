#!/bin/bash

echo "🚀 Setting up NarrativeAI Backend..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found. Please install PostgreSQL and create a database."
else
    echo "✅ PostgreSQL found"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "📄 Setting up environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
    echo "⚠️  Please edit .env file with your configuration before continuing"
    echo ""
    echo "Required configuration:"
    echo "  - DATABASE_URL: PostgreSQL connection string"
    echo "  - JWT_SECRET: Random secure string"
    echo "  - MISTRAL_API_KEY: Get from https://console.mistral.ai"
    echo ""
    read -p "Press Enter after configuring .env file..."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🗄️  Setting up database..."
npm run prisma:generate
npm run prisma:migrate

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "The server will be available at http://localhost:3001"
