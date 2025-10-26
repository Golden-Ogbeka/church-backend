# TFH Backend - RESTful API Server

![Node.js](https://img.shields.io/badge/Node.js-v16+-green) ![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue) ![Express](https://img.shields.io/badge/Express-4.18+-red) ![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green) ![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange)

The central backend API server for The Father's House Church digital platform. This RESTful API provides dual database support and serves all client applications including the public website, mobile app, and admin dashboard.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [API Versions](#api-versions)
- [Database Schema](#database-schema)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Deployment](#deployment)

## 🎯 Overview

The TFH Backend serves as the central data management system for The Father's House Church, providing:

- **Dual Database Architecture**: MongoDB (v1) and MySQL (v2) support
- **API Versioning**: Separate v1 and v2 endpoints for different client needs
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **File Management**: Cloudinary integration for media storage
- **Email Services**: Automated email notifications and newsletters
- **Input Validation**: Comprehensive request validation and sanitization
- **Error Handling**: Structured error responses and logging

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    TFH Backend API                      │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐              ┌─────────────┐          │
│  │   API v1    │              │   API v2    │          │
│  │  (MongoDB)  │              │   (MySQL)   │          │
│  │ Controllers │              │ Controllers │          │
│  │ Models      │              │ Models      │          │
│  │ Routes      │              │ Routes      │          │
│  │ Middlewares │              │ Middlewares │          │
│  └─────────────┘              └─────────────┘          │
├─────────────────────────────────────────────────────────┤
│           Shared Services & Utilities                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ Cloudinary  │ │   Mailer    │ │    Auth     │       │
│  │   Storage   │ │  Service    │ │  Functions  │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
└─────────────────────────────────────────────────────────┘
```

## 🛠️ Technology Stack

### Core Technologies
- **Runtime**: Node.js (v16+)
- **Language**: TypeScript (4.9+)
- **Framework**: Express.js (4.18+)
- **Process Manager**: Nodemon (development)

### Databases & ORMs
- **MongoDB**: Primary database with Mongoose ODM
- **MySQL**: Secondary database with Sequelize ORM
- **Pagination**: mongoose-paginate-v2, sequelize pagination

### Authentication & Security
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing and validation
- **Express-JWT**: JWT middleware for Express
- **CORS**: Cross-origin resource sharing configuration

### File & Media Management
- **Cloudinary**: Cloud-based media storage and optimization
- **Multer**: File upload handling middleware

### Email Services
- **Nodemailer**: Email sending functionality
- **Mailgen**: Dynamic email template generation

## 📁 Project Structure

```
tfh-backend/
├── api/
│   ├── index.ts                 # API version routing
│   ├── v1/                      # MongoDB-based API
│   │   ├── controllers/         # Business logic controllers
│   │   ├── middlewares/         # Custom middleware
│   │   ├── models/              # MongoDB models
│   │   └── routes/              # API route definitions
│   └── v2/                      # MySQL-based API
│       ├── controllers/         # Business logic controllers
│       ├── middlewares/         # Custom middleware
│       ├── models/              # MySQL models (Sequelize)
│       ├── routes/              # API route definitions
│       └── seeders/             # Database seeders
├── config/
│   └── db.ts                    # Database connections
├── functions/                   # Utility functions
├── types/                       # TypeScript definitions
├── utils/                       # Helper utilities
├── index.ts                     # Main server entry point
├── package.json                 # Dependencies and scripts
└── tsconfig.json                # TypeScript configuration
```

## 🔌 API Versions

### API v1 (MongoDB-based)
**Base URL**: `/api/v1`
**Available Endpoints**: admin, announcement, devotional, event, feedback, statistics, testimony, tfcc, tfccZone, user

### API v2 (MySQL-based)
**Base URL**: `/api/v2`
**Available Endpoints**: All v1 endpoints plus assignedFirstTimer, assignedSecondTimer, bulletinSubscribers, churches, department, tfccCell, tfccLeader, unit, visitor

## 🗄️ Database Schema

### Core Models

#### User Model
```typescript
interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  dateOfBirth: string;
  churchCenter: string;
  member: boolean;
  registrationSource: 'web' | 'mobile';
}
```

#### Devotional Model
```typescript
interface IDevotional {
  date: Date;
  title: string;
  text: string;
  mainText: string;
  content: string;
  confession: string;
  furtherReading: string[];
  oneYearBibleReading: string[];
  twoYearsBibleReading: string[];
  views: number;
}
```

#### Event Model
```typescript
interface IEvent {
  name: string;
  theme: string;
  mainText: string;
  date: Date;
  time: string;
  allowRegistration: boolean;
  registrationEntries: any[];
  gallery: string[];
  poster: string;
  location: string;
  description: string;
}
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB instance
- MySQL instance (v8.0+)
- Cloudinary account
- Email service (SMTP)

### Installation Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start Development Server**
```bash
npm run dev
```

4. **Start Production Server**
```bash
npm run start
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/tfh_database

# MySQL Configuration (v2)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=tfh_v2
MYSQL_USERNAME=root
MYSQL_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=24h

# API Security
API_KEY=your_api_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 📚 API Documentation

### Authentication Flow

#### User Registration
```http
POST /api/v1/user/register
Content-Type: application/json
x-api-key: your_api_key

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "churchCenter": "Main Campus",
  "member": true,
  "registrationSource": "web"
}
```

#### User Login
```http
POST /api/v1/user/login
Content-Type: application/json
x-api-key: your_api_key

{
  "email": "john@example.com",
  "password": "securePassword"
}
```

### Key Endpoints

#### Get Today's Devotional
```http
GET /api/v2/devotional/today
x-api-key: your_api_key
```

#### Submit Testimony
```http
POST /api/v1/testimony
Content-Type: application/json
x-api-key: your_api_key

{
  "fullName": "Jane Smith",
  "phoneNumber": "+1234567890",
  "summary": "Healing Testimony",
  "content": "God healed me from...",
  "source": "web"
}
```

### Response Format

#### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": {
    "totalDocs": 100,
    "limit": 10,
    "page": 1,
    "totalPages": 10
  }
}
```

## 🔐 Authentication

### JWT Token Structure
- **Header**: Contains algorithm and token type
- **Payload**: Contains user ID, role, and expiration
- **Signature**: Verifies token authenticity

### Role-Based Access Control
- **User**: Basic authenticated user
- **Admin**: Church administrator with management access
- **Super Admin**: Full system access and user management

## 🌐 Deployment

### Production Setup

1. **Environment Variables**
```bash
export NODE_ENV=production
export PORT=80
```

2. **Database Setup**
```bash
# Ensure production databases are configured
# Run MySQL migrations
npx sequelize-cli db:migrate
```

3. **Start Server**
```bash
npm start
```

### Health Check
```http
GET /
```
Returns: `{"message": "Welcome to TFH Admin."}`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Create Pull Request

---

**Built with ❤️ for The Father's House Church**

### Church Website
https://tfhconline.org.ng/

#### API Documentation: 
https://tfh-documentation.postman.co/workspace/TFH~ebce6ee8-be76-494d-8df3-555f759babb2/collection/25358026-6e034a8f-f53c-4e13-9ef8-4a5b40f60467?action=share&creator=11204995)https://tfh-documentation.postman.co/workspace/TFH~ebce6ee8-be76-494d-8df3-555f759babb2/collection/25358026-6e034a8f-f53c-4e13-9ef8-4a5b40f60467?action=share&creator=11204995

Feel free to download and use as a template to create the backend API for the church you belong to
