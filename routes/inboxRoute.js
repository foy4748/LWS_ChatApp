const express = require("express");

const {
  inboxGetControl,
  inboxUserGetControl,
  inboxConvPostControl,
  inboxMessageGetControl,
  inboxMessagePostControl,
  inboxConvDeleteControl,
  inboxConvSearchPostController,
} = require("../Controllers/inboxControl");
const titleSetter = require("../MW/titleSetter");
const authGuard = require("../MW/authGuard");
const attachmentUpload = require("../MW/attachmentUpload");

const router = express.Router();

// - - - - - - - - - - GET  METHODS - - - - - - - - - -
//
//Renders LOGIN page
router.get("/", titleSetter("INBOX"), authGuard, inboxGetControl);

//Gets messages and
//responses those
//messages as JSON
router.get("/messages/:conversation_id", authGuard, inboxMessageGetControl);

// - - - - - - - - - - POST METHODS - - - - - - - - - -

//Search users
//for making conversation
router.post("/search", authGuard, inboxUserGetControl);

//Search conversations
//based on user's query
router.post("/search/conversation", authGuard, inboxConvSearchPostController);

//Creating Conversation with other user
router.post("/conversation", authGuard, inboxConvPostControl);

//POSTing Messages on db
router.post("/message", authGuard, attachmentUpload, inboxMessagePostControl);

//DELETEing Conversation along with associated messages
router.delete("/conversation/:id", authGuard, inboxConvDeleteControl);

module.exports = router;
