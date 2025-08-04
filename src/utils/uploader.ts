import multer from "multer";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default multer.diskStorage({
  // destination of file/image that client send
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "public", "hotels", "images");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  // create random and specific file name
  filename: (req, file, cb) => {
    const hashedFileName =
      crypto.createHash("SHA256").update(file.originalname).digest("hex") +
      file.originalname;
    cb(null, hashedFileName);
  },
});
