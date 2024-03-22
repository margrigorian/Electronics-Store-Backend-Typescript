import multer from "multer";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: function (req: Request, file, cb) {
    cb(null, "images"); // вторым параметром передается путь к папке, где будут храниться файлы
  },
  filename: function (req: Request, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // задаем имя файла
  }
});

const types = ["image/png", "image/jpeg", "image/jpg"];

interface MulterFile {
  fieldname: string;
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

const fileFilter: (req: Request, file: MulterFile, cb: multer.FileFilterCallback) => void = (
  req: Request,
  file: MulterFile,
  cb: multer.FileFilterCallback
) => {
  if (types.includes(file.mimetype)) {
    cb(null, true); // файл прошел валидацию, ставим флаг true
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
