import { Request } from "express";
import multer from "multer";

const JSONCSVFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: any
) => {

    if (
    (file.mimetype === "text/csv" || file.mimetype === "text/json") &&
    ["csv", "json"].includes(
      file.originalname
        .split(".")
        [file.originalname.split(".").length - 1]?.toLowerCase()
    )
  ) {
    file.originalname = file.originalname
      .split(".")
      .map((item) => item.toLowerCase())
      .join(".");

    callback(null, true);
  } else {
    const error = new Error("Invalid file type, only CSV is allowed!");

    error.stack = "Invalid file type, only JSON/CSV is allowed!";

    error.name = "InvalidFileTypeError";

    callback(error, false);
  }
};
const uploadJsonCsvMiddleware = multer({ fileFilter: JSONCSVFileFilter });

export { uploadJsonCsvMiddleware };
