const mongoose = require("mongoose");

const confirmOrderSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "users",
    },
    productDetail: {
      type: mongoose.Types.ObjectId,
      ref: "products",
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    orderQuantity: {
      type: Number,
      required: true,
      default: 1,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentStatus: {
      type: String,
      default: "paid",
    },
    razorpayOrderId: {
      type: String,
      default: "",
    },
    razorpayPaymentId: {
      type: String,
      default: "",
    },
    razorpaySignature: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      required: true,
      default: "Ordered",
    },
  },
  { timestamps: true }
);

const ConfirmedOrder = mongoose.model("orders", confirmOrderSchema);

module.exports = ConfirmedOrder;