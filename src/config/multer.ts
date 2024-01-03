import multer from "multer";

export const multerConfig = (folder: string) => {
  return {
    storage: multer.memoryStorage(), // Armazenamento em memória para o Amazon S3
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
        callback(new Error("Invalid file type."));
      }
    },
  };
};
