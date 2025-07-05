const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

module.exports = multer.diskStorage({
  // destination of file/image that client send
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "public", "hotels", "images"));
  },
  // create random and specific file name 
  filename: (req, file, cb) => {
    const hashedFileName = crypto
      .createHash("SHA256")
      .update(file.originalname)
      .digest("hex");
    cb(null, hashedFileName);
  },
});
