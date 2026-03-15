const express = require("express");
const { chatbotMessageController } = require("../controllers/chatbotController");

const router = express.Router();

router.post("/message", chatbotMessageController);

module.exports = router;