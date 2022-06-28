
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const multer = require('multer');

// a .env file is considered a safe storage, only we have access to the info content, they are not seeing in the code
cloudinary.config(
    {
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET
    }
  );

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      allowed_formats: ['svg', 'png', 'jpg'],
      folder: 'room-image' // Folder name on the Cloudinary disk
    }
  });

  module.exports = multer({storage})*/ // Multer will be responsible for reading the form and store on the cloud