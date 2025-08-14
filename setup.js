const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Excel Analytics Platform...\n');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, 'backend', '.env');
if (!fs.existsSync(envPath)) {
  const envContent = `# Server Configuration
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
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created backend/.env file');
} else {
  console.log('✅ backend/.env file already exists');
}

// Create uploads directory
const uploadsPath = path.join(__dirname, 'backend', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('✅ Created uploads directory');
} else {
  console.log('✅ uploads directory already exists');
}

console.log('\n📋 Setup Complete!');
console.log('\n📝 Next Steps:');
console.log('1. Install dependencies: npm run install-all');
console.log('2. Start MongoDB (if using local instance)');
console.log('3. Run the application: npm run dev');
console.log('\n🌐 Access Points:');
console.log('- Frontend: http://localhost:3000');
console.log('- Backend API: http://localhost:5000');
console.log('- Health Check: http://localhost:5000/health'); 