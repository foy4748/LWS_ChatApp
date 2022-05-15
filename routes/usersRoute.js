const express = require("express");
//
//Controllers
const {
  usersGetControl,
  usersPostControl,
  usersDeleteControl,
} = require("../Controllers/usersControl");

//Middlewares
const titleSetter = require("../MW/titleSetter");
const avatarUploader = require("../MW/avatarUploader");
const authGuard = require("../MW/authGuard");
const adminGuard = require("../MW/adminGuard");

const {
  arrayOfValidators,
  addUserValidationHandler,
} = require("../MW/validateUserSignUp");

const router = express.Router();

router.get("/", titleSetter("USERS"), authGuard, adminGuard, usersGetControl);

router.post(
  "/",
  authGuard,
  adminGuard,
  avatarUploader,
  arrayOfValidators,
  addUserValidationHandler,
  usersPostControl
);

router.delete("/:id", authGuard, adminGuard, usersDeleteControl);

module.exports = router;
