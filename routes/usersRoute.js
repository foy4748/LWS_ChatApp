const express = require("express");
const { usersGetControl } = require("../Controllers/usersControl");
const titleSetter = require("../MW/titleSetter");

const router = express.Router();

router.get("/", titleSetter("USERS"), usersGetControl);

module.exports = router;
