const path = require("path");
const fs = require("fs");
const QRCode = require("qrcode");
const File = require("../models/File");
const Product = require("../models/Products");
const Category = require("../models/Category");

const createProduct = async (req, res, next) => {
  try {
    const {
      productName,
      category,
      price,
      quantity,
      productDesc,
      discountedPrice,
      brand,
      isFeatured
    } = req.body;

    const isFeaturedBoolean = isFeatured === "true";

    if (!productName) {
      return res.status(400).json({ message: "Product name is required" });
    }

    const pic = req.pic;
    const { _id } = req.user;

    if (!pic) {
      return res.status(400).json({ message: "Image not uploaded" });
    }

    // ✅ Save Image
    const picture = await File.create({
      fileName: pic,
      addedBy: _id
    });

    // ✅ Find Category
    const categoryFind = await Category.findOne({
      title: { $regex: category, $options: "i" }
    });

    if (!categoryFind) {
      return res.status(404).json({ message: "Category not found" });
    }

    const categoryId = categoryFind._id;

    // ✅ Check Duplicate Product
    const isExists = await Product.findOne({
      productName,
      category: categoryId,
      createdBy: _id
    });

    if (isExists) {
      return res.status(400).json({
        message: "Product already exists"
      });
    }

    console.log("Creating Product...");

    // ✅ Create Product
    const product = await Product.create({
      productName,
      productDesc,
      category: categoryId,
      price: Number(price),
      discountedPrice: Number(discountedPrice),
      pic: picture._id,
      createdBy: _id,
      brand,
      quantity: Number(quantity),
      isFeatured: isFeaturedBoolean
    });

    // ✅ Generate QR Folder
    const qrFolder = path.join(__dirname, "../uploads/qr");

    if (!fs.existsSync(qrFolder)) {
      fs.mkdirSync(qrFolder, { recursive: true });
    }

    const qrPath = path.join(qrFolder, `${product.uuid}.png`);

    // ✅ Generate QR From UUID
    await QRCode.toFile(qrPath, product.uuid, {
      width: 300
    });

    // ✅ Save QR Path In Product
    product.qrCode = `uploads/qr/${product.uuid}.png`;

    await product.save();

    res.status(200).json({
      status: true,
      message: "Product added successfully",
      product
    });

  } catch (error) {
    console.error("Create Product Error:", error);
    next(error);
  }
};

module.exports = { createProduct };

const updateProduct = async (req, res, next) => {
  try {
    const { productName, category, price, quantity, productDesc, discountedPrice, brand } = req.body;
    const pic = req.pic;
    const { _id } = req.user;
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      res.code = 404;
      throw new Error("Product not found");
    }

    const categoryFind = await Category.findOne({ title: category });
    if (!categoryFind) {
      res.code = 404;
      throw new Error("Category not found");
    }

    const picId = product.pic;

    const picture = await File.findById(picId);
    picture.fileName = pic;
    await picture.save();

    const categoryId = categoryFind._id;
    product.productName = productName ? productName : product.productName;
    product.productDesc = productDesc ? productDesc : product.productDesc;
    product.price = price ? price : product.price;
    product.category = categoryId ? categoryId : product.category;

    product.discountedPrice = discountedPrice ? discountedPrice : product.discountedPrice;
    product.createdBy = _id ? _id : product.createdBy;
    product.brand = brand ? brand : product.brand;
    product.quantity = quantity ? quantity : product.quantity;

    await product.save();

    res.status(200).json({ code: 200, status: true, message: "Product updated successfully" });
  }
  catch (error) {
    next(error);
  }
}

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      res.code = 404;
      throw new Error("Product not found");
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({ code: 200, status: true, message: "Product deleted successfully" });
  }
  catch (error) {
    next(error);
  }
}


const getAllProduct = async (req, res, next) => {
  try {
    const {
      q,
      search,
      size = 12,
      page = 1,
      brand,
      price,
      category,
      isFeatured,
      sort
    } = req.query;

    const searchValue = (q || search)?.trim();
    const sizeNumber = parseInt(size);
    const pageNumber = parseInt(page);

    let query = {};

    /* ===========================
       🔎 GLOBAL SEARCH (PARTIAL SAFE)
    =========================== */
    if (searchValue) {
      query.$or = [
        { productName: { $regex: searchValue, $options: "i" } },
        { brand: { $regex: searchValue, $options: "i" } },
        { productDesc: { $regex: searchValue, $options: "i" } }
      ];
    }

    /* ===========================
       🏷 BRAND FILTER
    =========================== */
    if (brand) {
      query.brand = { $regex: brand, $options: "i" };
    }

    /* ===========================
       💰 PRICE FILTER
    =========================== */
    if (price) {
      if (price.includes("-")) {
        const [min, max] = price.split("-").map(Number);
        query.price = { $gte: min, $lte: max };
      } else {
        query.price = Number(price);
      }
    }

    /* ===========================
       ⭐ FEATURED FILTER
    =========================== */
    if (typeof isFeatured !== "undefined") {
      query.isFeatured = isFeatured === "true";
    }

    /* ===========================
       📂 CATEGORY FILTER
    =========================== */
    if (category) {
      const categories = await Category.find({
        title: { $regex: category, $options: "i" }
      }).select("_id");

      const categoryIds = categories.map(c => c._id);

      if (categoryIds.length > 0) {
        query.category = { $in: categoryIds };
      } else {
        return res.status(200).json({
          code: 200,
          status: true,
          message: "No products found",
          data: {
            productDetails: [],
            total: 0,
            pages: 0,
            count: 0
          }
        });
      }
    }

    /* ===========================
       📊 COUNT
    =========================== */
    const total = await Product.countDocuments(query);
    const pages = Math.ceil(total / sizeNumber);

    /* ===========================
       📊 SORTING
    =========================== */
    let sortOption = { updatedAt: -1 };

    if (sort) {
      switch (sort) {
        case "price-low":
          sortOption = { price: 1 };
          break;
        case "price-high":
          sortOption = { price: -1 };
          break;
        case "rating":
          sortOption = { ratings: -1 };
          break;
        case "newest":
          sortOption = { createdAt: -1 };
          break;
      }
    }

    /* ===========================
       📦 FETCH PRODUCTS
    =========================== */
    const productDetails = await Product.find(query)
      .sort(sortOption)
      .populate("pic")
      .populate("category")
      .populate("specailzation.detail")
      .skip((pageNumber - 1) * sizeNumber)
      .limit(sizeNumber);

    return res.status(200).json({
      code: 200,
      status: true,
      message: "Product List",
      data: {
        productDetails,
        total,
        pages,
        count: productDetails.length
      }
    });

  } catch (error) {
    next(error);
  }
};

const getOneProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("category")
      .populate("pic")
      .populate("specailzation.detail");

    if (!product) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      code: 200,
      status: true,
      message: "Product retrieved successfully",
      data: { product }
    });

  } catch (error) {
    next(error);
  }
};

// const getOneProduct=async(req,res,next)=>{
//     try{        
//         const {id}=req.params;

//         const product=await Product.findById(id).populate("category").populate("pic").populate("specailzation.detail");
//         if(!product)
//         {
//             res.code=404;
//             throw new Error("Product not found");
//         }

//         res.status(200).json({code:200,status:true,message:"Product List",data:{product}});
//     }
//     catch(error)
//     {
//         next(error);
//     }
// }


const setFeaturedProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      res.code = 404;
      throw new Error("Product not found");
    }

    product.isFeatured = true;
    await product.save();

    res.status(200).json({ code: 200, status: true, message: "Product added to featured product" });
  }
  catch (error) {
    next(error);
  }
}

module.exports = { createProduct, updateProduct, deleteProduct, getAllProduct, getOneProduct, setFeaturedProduct };