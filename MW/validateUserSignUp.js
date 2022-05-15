const createError = require("http-errors");
const { check, validationResult } = require("express-validator");
const PEOPLE = require("../Models/PeopleModel");
const { unlink, unlinkSync } = require("fs");
const path = require("path");

const arrayOfValidators = [
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .isAlpha("en-US", { ignore: "- _" })
    .withMessage("Name can't contain anything otherthan alphabet"),
  check("email")
    .isEmail()
    .withMessage("Invalid EMAIL address")
    .trim()
    .custom(async (value) => {
      const user = await PEOPLE.findOne({ email: value });
      try {
        if (user) {
          throw createError("Email already in use");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("mobile")
    .isMobilePhone("bn-BD", {
      strictMode: true,
    })
    .withMessage("Invalid Mobile no. Must be Bangladeshi mobile no")
    .custom(async (val) => {
      const user = await PEOPLE.findOne({ mobile: val });

      try {
        if (user) {
          throw createError("Mobile no already in use");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("password")
    .isStrongPassword({ minLength: 6 })
    .withMessage("Password is not Strong enough. Must contain 6 chars"),
];

const addUserValidationHandler = (req, res, next) => {
  const error = validationResult(req);
  const mappedErrors = error.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    if (req.files.length > 0) {
      const { filename } = req.files[0];
      unlink(
        path.join(__dirname, `/../public/uploads/avatar/${filename}`),
        (err) => {
          if (err) console.log(err);
        }
      );
    }
    res.status(500).json({
      errors: mappedErrors,
    });
  }
};

module.exports = {
  arrayOfValidators,
  addUserValidationHandler,
};
