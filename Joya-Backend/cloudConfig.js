const cloudinary = require("cloudinary");

const multerStorageCloudinary = require("multer-storage-cloudinary");
const CloudinaryStorage =
  multerStorageCloudinary.CloudinaryStorage || multerStorageCloudinary;

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "joya_DEV",
    allowedFormats: ["png", "jpg", "jpeg"],
  },
});

module.exports = {
  cloudinary: cloudinary.v2,
  storage,
};
