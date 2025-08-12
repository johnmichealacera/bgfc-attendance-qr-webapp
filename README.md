# QR Attendance System MVP

A fullstack QR code-based attendance tracking system for colleges, built with Next.js, TypeScript, and PostgreSQL.

## 🚀 Features

### Core Functionality
- **QR Code Generation**: Each student gets a unique QR code (S<8-digit-ID> format)
- **QR Code Scanning**: Camera-based scanning with USB scanner support
- **Attendance Logging**: Real-time attendance tracking with duplicate prevention
- **Role-based Access**: Admin, Faculty, and Student dashboards
- **Responsive Design**: Works on desktop and mobile devices

### User Roles
- **Admin**: Manage users, view all attendance, generate reports
- **Faculty**: View attendance for assigned classes, scan QR codes
- **Student**: View personal attendance history, download QR code

### Technical Features
- **Next.js 14**: Latest version with App Router
- **TypeScript**: Full type safety
- **Prisma ORM**: Database management with PostgreSQL
- **NextAuth.js**: JWT-based authentication
- **Tailwind CSS**: Modern, responsive styling
- **Docker Support**: Ready for containerized deployment

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with JWT
- **Styling**: Tailwind CSS
- **QR Code**: qrcode npm package
- **Testing**: Jest, React Testing Library
- **Deployment**: Docker, Docker Compose

## 📋 Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- PostgreSQL (or use Docker)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd qr-attendance-system
npm install
```

### 2. Environment Configuration

Copy the environment file and configure your database:

```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/qr_attendance_db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build the image
docker build -t qr-attendance-system .

# Run the container
docker run -p 3000:3000 qr-attendance-system
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- components/QRScanner.test.tsx
```

## 📊 Database Schema

### Users Table
- `id`: Unique identifier
- `name`: User's full name
- `email`: Email address (unique)
- `passwordHash`: Encrypted password
- `role`: User role (ADMIN, FACULTY, STUDENT)
- `createdAt`, `updatedAt`: Timestamps

### Students Table
- `id`: Unique identifier
- `studentId`: Student ID (S<8-digit-ID>)
- `qrCodeValue`: QR code string value
- `qrCodeImageUrl`: Generated QR code image URL
- `userId`: Reference to users table

### Attendance Table
- `id`: Unique identifier
- `studentId`: Reference to students table
- `timestamp`: Attendance timestamp
- `gateLocation`: Gate/location where attendance was logged

## 🔐 Authentication

The system uses NextAuth.js with JWT strategy:

- **Credentials Provider**: Email/password authentication
- **Session Management**: JWT-based sessions
- **Role-based Access Control**: Different permissions per user role
- **Protected Routes**: API routes and pages require authentication

## 📱 QR Code System

### QR Code Format
- **Pattern**: `S<8-digit-ID>` (e.g., S20250001)
- **Generation**: Automatic generation for each student
- **Storage**: Both string value and image URL stored in database

### Scanning Methods
1. **Camera Scanning**: Use device camera to scan QR codes
2. **USB Scanner**: Connect USB QR scanner for manual input mode
3. **Manual Input**: Type QR codes manually for testing

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Attendance
- `POST /api/attendance/log` - Log attendance from QR scan

### Statistics
- `GET /api/admin/stats` - Admin dashboard statistics
- `GET /api/faculty/stats` - Faculty dashboard statistics
- `GET /api/student/stats` - Student dashboard statistics

## 👥 Demo Accounts

After seeding the database, you can use these accounts:

### Admin
- **Email**: admin@college.edu
- **Password**: admin123

### Faculty
- **Email**: prof.smith@college.edu
- **Password**: faculty123

### Student
- **Email**: alice.johnson@college.edu
- **Password**: student123

## 🚧 Development

### Project Structure
```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── dashboard/         # Dashboard components
│   ├── layout/            # Layout components
│   ├── qr/                # QR-related components
│   └── ui/                # UI components
├── prisma/                # Database schema and migrations
├── tests/                 # Test files
└── package.json           # Dependencies and scripts
```

### Adding New Features
1. Create component in appropriate directory
2. Add TypeScript interfaces
3. Create API routes if needed
4. Add tests for new functionality
5. Update documentation

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Tokens**: Secure session management
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **Role-based Access**: API endpoints protected by user role

## 📈 Performance

- **Database Indexing**: Optimized queries with Prisma
- **Image Optimization**: Next.js Image component for QR codes
- **Lazy Loading**: Components loaded on demand
- **Caching**: Next.js built-in caching mechanisms

## 🚀 Deployment

### Production Environment Variables
```env
DATABASE_URL="postgresql://username:password@host:port/database"
NEXTAUTH_SECRET="strong-secret-key"
NEXTAUTH_URL="https://yourdomain.com"
NODE_ENV="production"
```

### Build and Deploy
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🔮 Future Enhancements

- **Real-time Updates**: WebSocket integration for live attendance
- **Advanced Analytics**: Detailed attendance reports and charts
- **Mobile App**: React Native mobile application
- **Offline Support**: Service worker for offline functionality
- **Multi-language**: Internationalization support
- **API Rate Limiting**: Enhanced security measures
- **Audit Logs**: Comprehensive activity tracking
- **Integration**: LMS and student information system integration

---

**Built with ❤️ using Next.js and modern web technologies**
