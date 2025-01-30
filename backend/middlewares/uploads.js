import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dol5532nm",
  api_key: "395179269256437",
  api_secret: "gda3bOZOzqROe6rY0T-_-fiiHVg"
});

// Define the upload directory
const uploadDir = path.join(process.cwd(), 'uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Middleware to handle file upload and Cloudinary upload
const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'uploads'
    });

    // Remove local file after upload
    await fs.unlink(req.file.path);

    // Attach Cloudinary URL to the request
    req.imageUrl = result.secure_url;

    next(); // Proceed to next middleware or controller
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

export { upload, uploadToCloudinary };