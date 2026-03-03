const express = require("express");
const router = express.Router();

const isAuth = require("../middlewares/isAuth");
const {
  getNotifications,
  getUnreadCount,
  createNotification,
  markRead,
  markAllRead,
  clearAll,
} = require("../controllers/notificationController");

// Admin protection: you can keep isAuth only or add role check inside isAuth.
router.get("/", isAuth, getNotifications);
router.get("/unread-count", isAuth, getUnreadCount);

router.post("/", isAuth, createNotification);
router.put("/:id/read", isAuth, markRead);
router.put("/read-all", isAuth, markAllRead);

router.delete("/clear", isAuth, clearAll);

module.exports = router;