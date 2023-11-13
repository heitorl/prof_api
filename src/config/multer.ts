import multer from "multer";
import path from "path";
import crypto from "crypto";

export const multerConfig = (folder: string) => {
  return {
    dest: path.resolve(__dirname, "..", "..", "temp", folder),
    storage: multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, path.resolve(__dirname, "..", "tmp", folder));
      },
      filename: (req, file, callback) => {
        crypto.randomBytes(4, (err, hash) => {
          // if (err) callback(err, "")

          const fileName = `${hash.toString("hex")}-${file.originalname}`;

          callback(null, fileName);
        });
      },
    }),
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req: any, file: any, callback: any) => {
      const allowedMimes = [
        "image/jpeg",
        "image/pjpeg",
        "image/png",
        "image/gif",
      ];

      if (allowedMimes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new Error("Invalid file type2."));
      }
    },
  };
};
