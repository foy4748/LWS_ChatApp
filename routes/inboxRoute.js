const express = require("express");
const { inboxGetControl } = require("../Controllers/inboxControl");
const titleSetter = require("../MW/titleSetter");
const authGuard = require("../MW/authGuard");

const router = express.Router();

router.get("/", titleSetter("INBOX"), authGuard, inboxGetControl);

module.exports = router;
