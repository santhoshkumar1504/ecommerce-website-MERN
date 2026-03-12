const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Product = require("../models/Products");
const ConfirmedOrder = require("../models/ConfirmedOrder");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (req, res) => {
  try {
    console.log("Razorpay createRazorpayOrder hit");

    const { productId } = req.params;
    const { quantity = 1, address } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product id is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product is not available",
      });
    }

    if (Number(quantity) > Number(product.quantity)) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity is not available",
      });
    }

    if (!address || !address.trim()) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    const amount =
      Number(product.discountedPrice || product.price || 0) * Number(quantity);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product amount",
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      productName: product.productName,
      quantity,
      address,
    });
  } catch (error) {
    console.log("createRazorpayOrder error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create Razorpay order",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      productId,
      quantity = 1,
      address,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    if (
      !productId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "All payment details are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    if (!address || !address.trim()) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product is not available",
      });
    }

    if (Number(quantity) > Number(product.quantity)) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity is not available",
      });
    }

    const alreadyExists = await ConfirmedOrder.findOne({
      razorpayPaymentId: razorpay_payment_id,
    });

    if (alreadyExists) {
      return res.status(200).json({
        code: 200,
        success: true,
        status: true,
        message: "Order placed",
        order: alreadyExists,
      });
    }

    const totalAmount =
      Number(product.discountedPrice || product.price || 0) * Number(quantity);

    const newOrder = await ConfirmedOrder.create({
      createdBy: req.user._id,
      productDetail: productId,
      orderQuantity: quantity,
      address,
      totalAmount,
      paymentStatus: "paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: "Ordered",
    });

    product.quantity = Number(product.quantity) - Number(quantity);
    await product.save();

    return res.status(200).json({
      code: 200,
      success: true,
      status: true,
      message: "Order placed",
      order: newOrder,
    });
  } catch (error) {
    console.log("verifyPayment error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Verification failed",
    });
  }
};

module.exports = { createRazorpayOrder, verifyPayment };