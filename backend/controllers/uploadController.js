const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 }, // 10MB default
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(xls|xlsx)$/i)) {
      return cb(new Error('Only .xls and .xlsx files are allowed'));
    }
    cb(null, true);
  }
});

// Handle file upload and parsing
const uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // Parse Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const headers = json[0] || [];
    const rows = json.slice(1);

    // Save file metadata to user's upload history
    if (req.user && req.user.userId) {
      await User.findByIdAndUpdate(
        req.user.userId,
        {
          $push: {
            uploadHistory: {
              fileName: req.file.filename,
              originalName: req.file.originalname,
              fileSize: req.file.size,
              chartConfigs: [],
            }
          },
          updatedAt: new Date()
        }
      );
    }

    res.json({
      success: true,
      message: 'File uploaded and parsed',
      data: {
        headers,
        preview: rows.slice(0, 10),
        rowCount: rows.length,
        fileName: req.file.filename,
        originalName: req.file.originalname
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to process file', error: error.message });
  }
};

module.exports = {
  upload,
  uploadExcel
}; 