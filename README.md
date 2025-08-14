# Excel Analytics Platform

A comprehensive Excel analytics platform with advanced features for data analysis, visualization, and collaboration.

## 🚀 Features

### Core Features
- **File Upload & Processing**: Upload Excel files (.xlsx, .xls, .csv)
- **Chart Generation**: Create bar, line, pie, and scatter charts
- **User Authentication**: JWT-based authentication with role management
- **Dashboard**: Overview of uploaded files and analytics

### Advanced Features (Coming Soon)
- **Data Transformation & Cleaning**: Column renaming, filtering, sorting, missing value handling
- **Advanced Analytics**: Custom chart builder, statistical summaries, pivot tables, 3D charts
- **Collaboration & Sharing**: File/chart sharing, team workspaces, commenting
- **Export & Reporting**: Export charts as images/PDF, automated reports
- **Data Source Integrations**: Cloud storage (Google Drive, Dropbox), database connections
- **User Experience**: Dark mode, mobile responsiveness, onboarding tour
- **Security & Compliance**: 2FA, audit logs, GDPR tools
- **Performance**: Background processing, caching
- **Notifications**: In-app and email notifications
- **AI-Powered Features**: Automated insights, natural language queries

## 🛠️ Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd excel-analytics-platform
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
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

## 🚀 Running the Application

### Development Mode (Recommended)
```bash
# Run both frontend and backend simultaneously
npm run dev
```

### Production Mode
```bash
# Build the frontend
npm run build

# Start the backend server
npm start
```

### Individual Services
```bash
# Run only the backend server
npm run server

# Run only the frontend client
npm run client
```

## 📱 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🔧 Project Structure

```
excel-analytics-platform/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # State management
│   │   ├── services/      # API services
│   │   └── context/       # React context
├── backend/               # Node.js/Express backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── config/           # Configuration files
└── uploads/              # File upload directory
```

## 🔐 Authentication

The platform uses JWT-based authentication with the following endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

## 📊 API Endpoints

### File Upload
- `POST /api/upload` - Upload Excel file
- `GET /api/upload/files` - Get user's uploaded files
- `GET /api/upload/parsed/:fileId` - Get parsed file data
- `DELETE /api/upload/:fileId` - Delete uploaded file

### New Features (Coming Soon)
- `/api/data-cleaning` - Data transformation tools
- `/api/advanced-analytics` - Advanced analytics
- `/api/collaboration` - Sharing and collaboration
- `/api/export-reporting` - Export and reporting
- `/api/data-integration` - Data source integrations
- `/api/security-compliance` - Security features
- `/api/performance` - Performance monitoring
- `/api/notifications` - Notification system
- `/api/ai-features` - AI-powered features

## 🧪 Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests (if configured)
cd client && npm test
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

**Note**: This is a comprehensive analytics platform with modular architecture. All new features are implemented as separate modules that don't interfere with existing functionality.