const uploader = require("./uploader");

function attachmentUpload(req, res, next) {
  const upload = uploader(
    "attachments",
    ["image/jpeg", "image/jpg", "image/png"],
    1000000,
    2, //Size limit in MB
    2, //Number of files allowed to upload
    "Only .jpg, jpeg or .png format allowed!"
  );

  // call the middleware function
  upload.any()(req, res, (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        errors: {
          attachment: {
            msg: err.message ? err.message : "INTERNAL ERROR",
          },
        },
      });
    } else {
      next();
    }
  });
}

module.exports = attachmentUpload;
