const path = require('path');
const multer = require('multer');

// Set up multer storage and file destination
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Export the upload function for use in other parts of the application
module.exports = upload;
