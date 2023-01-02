import multer, { FileFilterCallback } from "multer";
import { v4 as uuidv4 } from "uuid";

const FILE_LIMIT = 700000;
const PATH_IMAGES_UPLOAD = "uploads/images";
const ERROR_MESSAGE = "Invalid mime type!";

const MIME_TYPE_MAP = new Map<string, string>([
  ["image/png", "png"],
  ["image/jpeg", "jpeg"],
  ["image/jpg", "jpg"],
]);

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const destFunc = (
  _req: Express.Request,
  _file: Express.Multer.File,
  cb: DestinationCallback
) => {
  cb(null, PATH_IMAGES_UPLOAD);
};

const fileNameFunc = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: FileNameCallback
) => {
  const ext = MIME_TYPE_MAP.get(file.mimetype);
  cb(null, uuidv4() + "." + ext);
};

const fileFilterFunc = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const isValid = !!MIME_TYPE_MAP.get(file.mimetype);
  isValid ? cb(null, isValid) : cb(new Error(ERROR_MESSAGE));
};

export const fileUpload = multer({
  limits: { fileSize: FILE_LIMIT },
  storage: multer.diskStorage({
    destination: destFunc,
    filename: fileNameFunc,
  }),
  fileFilter: fileFilterFunc,
});
