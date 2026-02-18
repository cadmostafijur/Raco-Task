import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import { config } from "../config";
import { BadRequestError } from "../utils/errors";

const ALLOWED_MIME_TYPES = ["application/zip", "application/x-zip-compressed"];
const ALLOWED_EXTENSION = ".zip";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = config.upload.dir;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ALLOWED_EXTENSION) {
      cb(new BadRequestError("Only .zip files are allowed") as any, "");
      return;
    }
    const filename = `${randomUUID()}${ALLOWED_EXTENSION}`;
    cb(null, filename);
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeValid = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const extValid = ext === ALLOWED_EXTENSION;

  if (!mimeValid || !extValid) {
    cb(new BadRequestError("Invalid file type. Only ZIP files are allowed"));
    return;
  }

  cb(null, true);
};

export const uploadZip = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
});
