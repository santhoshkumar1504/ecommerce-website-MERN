const express = require("express");
const isAuth = require("../middlewares/isAuth");
const { paymentController } = require("../controllers");
const router = express.Router();


router.post("/create-order/:productId",isAuth,paymentController.createRazorpayOrder);
router.post("/verify-payment", isAuth, paymentController.verifyPayment);

module.exports = router;