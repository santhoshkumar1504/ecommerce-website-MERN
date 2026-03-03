const Checkout = require("../models/Checkout");
const Product = require("../models/Products");
const User = require("../models/User");


const updateCheckoutQuantity = async (req, res, next) => {
  try {
    const { id } = req.params; // checkout item id
    const { _id } = req.user;
    const { quantity } = req.body;

    const qty = Number(quantity);

    if (!qty || qty < 1) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Quantity must be >= 1",
      });
    }

    const item = await Checkout.findOne({ _id: id, createdBy: _id });
    if (!item) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "Checkout item not found",
      });
    }

    item.quantity = qty;
    await item.save();

    return res.status(200).json({
      code: 200,
      status: true,
      message: "Quantity updated",
      data: { item },
    });
  } catch (err) {
    next(err);
  }
};

const addToCheckOut = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id } = req.user;
    const { quantity } = req.body;

    const product = await Product.findById(id);
    if (product) {
      const isExists = await Checkout.findOne({
        productId: product._id,
        createdBy: _id
      });
      if (isExists) {
        res.code = 400;
        throw new Error("Product already added");
      }
    }

    if (!product) {
      res.code = 404;
      throw new Error("Product not found.");
    }

    const user = await User.findById(_id);
    if (!user) {
      res.code = 404;
      throw new Error("User not found.")
    }

    await Checkout.create({
      productId: product._id,
      createdBy: user._id,
      quantity
    });

    res.status(200).json({ code: 200, status: true, message: "Product added to cart" })
  }
  catch (error) {
    next(error);
  }
}

const getMyCheckout = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const products = await Checkout.find({ createdBy: _id })
      .populate({
        path: "productId",
        populate: [
          { path: "pic" },
          { path: "category" },
          { path: "specailzation.detail" }
        ]
      });

    const count = products.length;

    return res.status(200).json({
      code: 200,
      status: true,
      message: "Your checkouts",
      data: {
        product: products,
        count
      }
    });

  } catch (error) {
    next(error);
  }
};

const deleteCheckout = async (req, res, next) => {
  try {
    const { id } = req.params;      // checkout id
    const { _id } = req.user;       // logged in user

    const checkoutItem = await Checkout.findOne({
      _id: id,
      createdBy: _id
    });

    if (!checkoutItem) {
      res.status(404);
      throw new Error("Checkout item not found");
    }

    await Checkout.deleteOne({ _id: id });

    res.status(200).json({
      code: 200,
      status: true,
      message: "Product removed from checkout"
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { addToCheckOut, getMyCheckout, deleteCheckout, updateCheckoutQuantity }