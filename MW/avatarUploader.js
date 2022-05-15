const uploader = require("./uploader");

const avatarUploader = (req, res, next) => {
  const upload = uploader(
    "avatar",
    ["image/jpeg", "image/png", "image/jpg"],
    10 * 1024 * 1024,
    "Only jpg, jpeg or png files are allowed to upload"
  );

  //Executing upload. As well
  //preventing Multer error from
  //hitting the default error handler

  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        errors: {
          avatar: {
            msg: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
};

module.exports = avatarUploader;
