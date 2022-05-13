const express = require("express");
const { loginGetControl } = require("../Controllers/loginControl");
const titleSetter = require("../MW/titleSetter");

const router = express.Router();

router.get("/", titleSetter("LOGIN"), loginGetControl);

module.exports = router;
