const { check, validationResult } = require("express-validator");

const loginValidators = [
  check("username")
    .isLength({ min: 1 })
    .withMessage("Mobile no or Emails is required"),
  check("password").isLength({ min: 1 }).withMessage("Password is required"),
];

const loginValidationHandle = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    res.render("index", {
      errors: mappedErrors,
      data: {
        username: req.body.username,
      },
    });
  }
};

module.exports = {
  loginValidators,
  loginValidationHandle,
};
