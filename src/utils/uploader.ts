import multer from "multer";
import path from "path";
import crypto from "crypto";

export default multer.diskStorage({
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
