const Product = require("../models/Products");
const User = require("../models/User");
const Likedproduct=require('../models/LikedProduct');

const addToLiked=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const {_id}=req.user;

        const product=await Product.findById(id);
        if(product)
        {
            const isExists=await Likedproduct.findOne({productId:product._id});
            if(isExists)
            {
                res.code=400;
                throw new Error("Product already added");
            }
        }
        if(!product)
        {
            res.code=404;
            throw new Error("Product not found.");
        }

        const user=await User.findById(_id);
        if(!user)
        {
            res.code=404;
            throw new Error("User not found");
        }

        await Likedproduct.insertOne({productId:product._id,createdBy:user._id});

        res.status(200).json({code:200,status:true,message:"Product added to likedproducts"})
    }
    catch(error)
    {
        next(error);
    }
}

const getMyLikedProducts=async (req,res,next)=>{
    try{
        const {_id}=req.user;
        const product=await Likedproduct.find({createdBy:_id}).populate("productId");
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

module.exports={addToLiked,getMyLikedProducts};