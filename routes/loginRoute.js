const page_title = "LOGIN";
const express = require("express");
const {
  loginGetControl,
  loginPostControl,
  loginDeleteControl,
} = require("../Controllers/loginControl");

//Middlewares
const {
  loginValidators,
  loginValidationHandle,
} = require("../MW/validateUserLogin");
const titleSetter = require("../MW/titleSetter");
const redirectLoggedIn = require("../MW/redirectLoggedIn");

const router = express.Router();

router.get("/", titleSetter(page_title), redirectLoggedIn, loginGetControl);
router.post(
  "/",
  titleSetter(page_title),
  loginValidators,
  loginValidationHandle,
  loginPostControl
);

router.delete("/", loginDeleteControl);

module.exports = router;
