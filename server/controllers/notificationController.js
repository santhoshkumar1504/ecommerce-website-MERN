const Notification = require("../models/Notification");

// GET all notifications
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    const unreadCount = await Notification.countDocuments({ isRead: false });

    return res.status(200).json({
      code: 200,
      status: true,
      message: "Notifications",
      data: { notifications, unreadCount },
    });
  } catch (err) {
    next(err);
  }
};

// GET only unread count (fast for badge)
const getUnreadCount = async (req, res, next) => {
  try {
    const unreadCount = await Notification.countDocuments({ isRead: false });

    return res.status(200).json({
      code: 200,
      status: true,
      message: "Unread Count",
      data: { unreadCount },
    });
  } catch (err) {
    next(err);
  }
};

// CREATE notification
const createNotification = async (req, res, next) => {
  try {
    const { title, message, type } = req.body;

    const notification = await Notification.create({
      title,
      message,
      type: type || "info",
    });

    return res.status(201).json({
      code: 201,
      status: true,
      message: "Notification created",
      data: { notification },
    });
  } catch (err) {
    next(err);
  }
};

// MARK single notification as read
const markRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndUpdate(id, { isRead: true });

    return res.status(200).json({
      code: 200,
      status: true,
      message: "Marked as read",
    });
  } catch (err) {
    next(err);
  }
};

// MARK all as read
const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });

    return res.status(200).json({
      code: 200,
      status: true,
      message: "All marked as read",
    });
  } catch (err) {
    next(err);
  }
};

// CLEAR ALL
const clearAll = async (req, res, next) => {
  try {
    await Notification.deleteMany({});
    return res.status(200).json({
      code: 200,
      status: true,
      message: "Cleared notifications",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  createNotification,
  markRead,
  markAllRead,
  clearAll,
};