const multer = require("multer");
const path = require("path");
const createError = require("http-errors");

const uploader = (folder_name, allowed_types, size_limit, err_msg) => {
  const UPLOAD_DIRECTORY = `${__dirname}/../public/uploads/${folder_name}`;

  const multerDiskStorageOptions = {
    destination: (req, file, cb) => {
      cb(null, UPLOAD_DIRECTORY);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname.replace(fileExt, "").split(" ").join("_") +
        `_${Date.now()}`;
      cb(null, fileName + fileExt);
    },
  };

  const storage = multer.diskStorage(multerDiskStorageOptions);

  const upld = multer({
    storage,
    limits: { fileSize: size_limit },
    fileFilter: (req, file, cb) => {
      if (allowed_types.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createError(err_msg));
      }
    },
  });

  return upld;
};

module.exports = uploader;
