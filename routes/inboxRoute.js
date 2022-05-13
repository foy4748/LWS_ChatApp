const express = require("express");
const { inboxGetControl } = require("../Controllers/inboxControl");
const titleSetter = require("../MW/titleSetter");

const router = express.Router();

router.get("/", titleSetter("INBOX"), inboxGetControl);

module.exports = router;
