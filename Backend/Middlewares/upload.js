const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinary");


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "posts", 
    resource_type: "auto", 
    allowed_formats: [
      "jpg", "png", "jpeg", "svg", "webp",
      "mp4", "mov", "avi", "mkv" // 👈 ADD THIS
    ],
  },
});

const upload = multer({ storage });

module.exports = upload;