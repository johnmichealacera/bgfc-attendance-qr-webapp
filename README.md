# QR Attendance System

A modern, web-based attendance tracking system for educational institutions using QR codes. Built with Next.js, Prisma, and NextAuth.js.

## 🚀 Features

- **QR Code Generation**: Unique QR codes for each student
- **Real-time Scanning**: Camera-based QR code scanning with fallback manual input
- **Role-based Access**: Admin, Faculty, and Student dashboards
- **Attendance Tracking**: Comprehensive attendance logging with gate locations
- **Data Export**: CSV export for attendance and student records
- **Public Scanner**: No-login required QR scanner for school gates
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with JWT
- **QR Code**: qrcode library
- **Password Hashing**: bcryptjs
- **UI Components**: Lucide React icons, React Hot Toast

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd attendance-qr-webapp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment example file and configure your variables:

```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/attendance_db"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-here-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# App
NODE_ENV="development"
```

### 4. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Run database migrations
npm run db:migrate

# Seed the database with initial data
npm run db:seed
```

#### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database named `attendance_db`
3. Update `DATABASE_URL` in `.env.local`
4. Run migrations and seed:

```bash
npm run db:migrate
npm run db:seed
```

### 5. Seed Student Data

The system comes with 677 pre-configured students. Seed them in batches:

```bash
# Seed all student batches
npm run db:seed:batch1
npm run db:seed:batch2
npm run db:seed:batch3
npm run db:seed:batch4
npm run db:seed:batch5
npm run db:seed:batch6
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 👥 Default Accounts

After seeding, you can log in with these demo accounts:

- **Admin**: `admin@college.edu` / `admin123`
- **Faculty**: `prof.smith@college.edu` / `faculty123`
- **Student**: `alice.johnson@college.edu` / `student123`

## 📱 Usage

### Public QR Scanner

- **URL**: `/qr-scanner`
- **Access**: No login required
- **Use Case**: School gates, entrances, public areas
- **Features**: Camera scanning, manual input, gate location selection

### Admin Dashboard

- **URL**: `/dashboard` (after login as admin)
- **Features**:
  - View system statistics
  - Manage students and faculty
  - View attendance records
  - Generate reports
  - Access QR scanner

### Faculty Dashboard

- **URL**: `/dashboard` (after login as faculty)
- **Features**:
  - View student attendance
  - Access QR scanner
  - Generate attendance reports

### Student Dashboard

- **URL**: `/dashboard` (after login as student)
- **Features**:
  - View personal attendance history
  - Download personal QR code

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed initial data
npm run db:studio    # Open Prisma Studio
npm run db:seed:batch1  # Seed batch 1 (students 1-103)
npm run db:seed:batch2  # Seed batch 2 (students 104-215)
npm run db:seed:batch3  # Seed batch 3 (students 216-327)
npm run db:seed:batch4  # Seed batch 4 (students 328-439)
npm run db:seed:batch5  # Seed batch 5 (students 440-551)
npm run db:seed:batch6  # Seed batch 6 (students 552-677)
```

## 🏗️ Project Structure

```
attendance-qr-webapp/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── attendance/    # Attendance management
│   │   ├── student/       # Student management
│   │   └── admin/         # Admin endpoints
│   ├── dashboard/         # Protected dashboard pages
│   ├── qr-scanner/        # Public QR scanner
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── dashboard/         # Dashboard components
│   ├── layout/            # Layout components
│   ├── providers/         # Context providers
│   ├── qr/                # QR code components
│   └── ui/                # UI components
├── prisma/                 # Database schema and migrations
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Initial seed data
│   └── seed-batch*.ts     # Student batch seed files
├── types/                  # TypeScript type definitions
├── .env.local             # Environment variables
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🗄️ Database Schema

### Core Models

- **User**: Base user model with authentication
- **Student**: Student-specific information and QR codes
- **Faculty**: Faculty member information
- **Attendance**: Attendance records with timestamps and locations

### Key Relationships

- One-to-one relationship between User and Student/Faculty
- One-to-many relationship between Student and Attendance
- Role-based access control through User.role field

## 🔐 Authentication & Security

- **NextAuth.js**: JWT-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Role-based Access**: Admin, Faculty, Student roles
- **Protected Routes**: Dashboard access requires authentication
- **Public Access**: QR scanner available without login

## 📊 Data Export

### Attendance Records
- Export filtered attendance data to CSV
- Include student information, timestamps, and gate locations
- Support for date and gate location filtering

### Student Records
- Export student information to CSV
- Include QR codes and attendance counts
- Support for search and year filtering

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
NODE_ENV="production"
```

### Build Command

The build process automatically runs Prisma generate:

```bash
npm run build  # Runs: prisma generate && next build
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**: Ensure PostgreSQL is running and DATABASE_URL is correct
2. **Prisma Issues**: Run `npx prisma generate` after schema changes
3. **Authentication**: Check NEXTAUTH_SECRET and NEXTAUTH_URL
4. **Camera Access**: Ensure HTTPS in production for camera permissions

### Development Tips

- Use `npm run db:studio` to inspect database
- Check browser console for client-side errors
- Monitor API routes in Network tab
- Use Prisma Studio for database debugging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

## 🔄 Updates

### Recent Changes
- Added comprehensive student seeding (677 students)
- Implemented batch seeding for large datasets
- Enhanced QR scanner with camera support
- Added data export functionality
- Improved role-based access control

---

**Built with ❤️ for educational institutions**
