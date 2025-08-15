#!/bin/bash

echo "🚀 Setting up QR Attendance System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local file..."
    cp env.example .env.local
    echo "⚠️  Please edit .env.local with your database credentials and NextAuth secret"
    echo "   - DATABASE_URL: Your PostgreSQL connection string"
    echo "   - NEXTAUTH_SECRET: A random secret string"
    echo "   - NEXTAUTH_URL: Your application URL (http://localhost:3000 for development)"
else
    echo "✅ .env.local already exists"
fi

# Check if Docker is available
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "🐳 Docker detected. Starting PostgreSQL..."
    docker-compose up -d
    
    # Wait for database to be ready
    echo "⏳ Waiting for database to be ready..."
    sleep 10
    
    echo "🗄️  Running database migrations..."
    npm run db:migrate
    
    echo "🌱 Seeding initial data..."
    npm run db:seed
    
    echo "📚 Seeding student data in batches..."
    npm run db:seed:batch1
    npm run db:seed:batch2
    npm run db:seed:batch3
    npm run db:seed:batch4
    npm run db:seed:batch5
    npm run db:seed:batch6
    
    echo "✅ Database setup complete!"
else
    echo "⚠️  Docker not found. Please set up PostgreSQL manually:"
    echo "   1. Install PostgreSQL"
    echo "   2. Create database 'attendance_db'"
    echo "   3. Update DATABASE_URL in .env.local"
    echo "   4. Run: npm run db:migrate"
    echo "   5. Run: npm run db:seed"
    echo "   6. Run student batch seeding commands"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your configuration"
echo "2. Start the development server: npm run dev"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Default accounts (after seeding):"
echo "- Admin: admin@college.edu / admin123"
echo "- Faculty: prof.smith@college.edu / faculty123"
echo "- Student: alice.johnson@college.edu / student123"
echo ""
echo "Happy coding! 🚀"
