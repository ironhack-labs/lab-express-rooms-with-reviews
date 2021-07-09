const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "ironhack/lab-express-rooms-with-reviews",
      allowedFormats: ["jpg", "png"],
    },
  });