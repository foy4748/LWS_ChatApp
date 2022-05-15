const express = require("express");
const {
  usersGetControl,
  usersPostControl,
  usersDeleteControl,
} = require("../Controllers/usersControl");
const titleSetter = require("../MW/titleSetter");
const avatarUploader = require("../MW/avatarUploader");
const {
  arrayOfValidators,
  addUserValidationHandler,
} = require("../MW/validateUserSignUp");

const router = express.Router();

router.get("/", titleSetter("USERS"), usersGetControl);

router.post(
  "/",
  avatarUploader,
  arrayOfValidators,
  addUserValidationHandler,
  usersPostControl
);

router.delete("/:id", usersDeleteControl);

module.exports = router;
