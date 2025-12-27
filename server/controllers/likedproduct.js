const Product = require("../models/Products");
const User = require("../models/User");
const Likedproduct=require('../models/LikedProduct');
const File = require("../models/File");

const addToLiked = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id

    const product = await Product.findById(id)
    if (!product) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: 'Product not found'
      })
    }

    const alreadyLiked = await Likedproduct.findOne({
      productId: product._id,
      createdBy: userId
    })

    const productpic=await File.findById(product.pic);
    const filename=productpic.fileName;

    if (alreadyLiked) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: 'Product already liked'
      })
    }

    await Likedproduct.create({
      productId: product._id,
      createdBy: userId,
      pics:filename
    })

    res.status(201).json({
      code: 201,
      status: true,
      message: 'Product added to liked products'
    })
  } catch (error) {
    next(error)
  }
}


const getMyLikedProducts=async (req,res,next)=>{
    try{
        const {q}=req.query;
        let query={};

        if(q)
        {
            const search=new RegExp(q,"i");
            query={
                $or:[{productName:search},
             { brand: search },{category:search}]
            };
        }
        const {_id}=req.user;  //req.user            _id
        const product=await Likedproduct.find({createdBy:_id}).populate("productId");

        if(q)
        {
          const product=await LikedProduct.find(query);
        }

        if(!product)
        {
            res.code=404;
            throw new Error("Product not found");
        }

        const count=await Likedproduct.countDocuments({createdBy:_id});

        res.status(200).json({code:200,status:true,message:"Your LikedProducts",data:{product,count}});
    }
    catch(error)
    {
        next(error);
    }
}

const setLikedProducts=async (req,res,next)=>{
    try{
        const {_id}=req.user;
        const {product,category}=req.body;
        const user=await User.findById(_id);
        if(!user)
        {
            res.code=404;
            throw new Error("User not found");
        }
        const isproduct = await Product.findOne({productName:product});
        if(isproduct)
        {
              const productpic=await File.findById(isproduct.pic);
              const filename=productpic.fileName;

         await Likedproduct.create({
      productId: isproduct._id,
      pics:filename
    })
        }

        res.status(200).json({code:200,status:true,message:"Liked products added successfully"});
        
    }
    catch(error)
    {
        next(error);
    }
}

const getLikedProduct=async (req,res,next)=>{
    try{
        const {_id}=req.user;
        const user=await User.findById(_id).select("likedProducts");
        if(!user)
        {
            res.code=404;
            throw new Error("User not found");
        }
        
        res.status(200).json({code:200,status:true,message:"Recommendations",data:{user}});
        
    }
    catch(error)
    {
        next(error);
    }
}

module.exports={addToLiked,getMyLikedProducts,setLikedProducts,getLikedProduct};