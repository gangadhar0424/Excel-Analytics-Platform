# Excel Analytics Platform - Backend API

A robust Node.js/Express backend API for the Excel Analytics Platform, providing authentication, file upload, and chart generation capabilities.

## 🚀 Features

- **JWT Authentication** with role-based access control
- **User Management** with admin capabilities
- **Excel File Processing** using SheetJS
- **Chart Generation** support for 2D and 3D visualizations
- **File Upload History** tracking
- **Rate Limiting** and security middleware
- **MongoDB Integration** with Mongoose ODM

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd excel-analytics-platform/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/excel-analytics

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000

   # File Upload Configuration
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # Security
   BCRYPT_SALT_ROUNDS=12
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js              # Database connection configuration
├── controllers/
│   └── authController.js  # Authentication logic
├── middleware/
│   └── authMiddleware.js  # JWT and role-based middleware
├── models/
│   └── User.js           # User schema and methods
├── routes/
│   └── authRoutes.js     # Authentication routes
├── server.js             # Main server file
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🔐 Authentication API

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt-token>
```

### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "username": "new_username",
  "email": "newemail@example.com"
}
```

### Change Password
```http
PUT /api/auth/change-password
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

## 👨‍💼 Admin API (Admin Role Required)

### Get All Users
```http
GET /api/auth/users
Authorization: Bearer <admin-jwt-token>
```

### Update User Role
```http
PUT /api/auth/users/:userId/role
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "role": "admin"
}
```

### Toggle User Status
```http
PUT /api/auth/users/:userId/status
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "isActive": false
}
```

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## 🛡️ Security Features

- **JWT Authentication** with configurable expiration
- **Password Hashing** using bcrypt
- **Rate Limiting** to prevent abuse
- **CORS Protection** with configurable origins
- **Helmet.js** for security headers
- **Input Validation** and sanitization
- **Role-based Access Control**

## 📊 Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  isActive: Boolean,
  uploadHistory: [{
    fileName: String,
    originalName: String,
    fileSize: Number,
    uploadDate: Date,
    chartConfigs: [{
      chartType: String,
      xAxis: String,
      yAxis: String,
      chartData: Mixed,
      createdAt: Date
    }]
  }],
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/excel-analytics
JWT_SECRET=your-super-secure-production-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- auth.test.js
```

## 📝 API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

## 🔗 Health Check

```http
GET /health
```

Response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2023-12-01T10:30:00.000Z",
  "environment": "development"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note**: This backend is designed to work with the Excel Analytics Platform frontend. Make sure to configure the frontend URL in your environment variables for proper CORS handling. 