const Checkout = require("../models/Checkout");
const Product = require("../models/Products");
const User = require("../models/User");

const addToCheckOut=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const {_id}=req.user;
        const {quantity}=req.body;

        const product=await Product.findById(id);
         if(product)
        {
            const isExists=await Checkout.findOne({productId:product._id});
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
            throw new Error("User not found.")
        }

        await Checkout.insertOne({productId:product._id,createdBy:user._id,quantity:quantity});

        res.status(200).json({code:200,status:true,message:"Product added to cart"})
    }
    catch(error)
    {
        next(error);
    }
}

const getMyCheckout=async(req,res,next)=>{
    try{
        const {_id}=req.user;
        const product=await Checkout.find({createdBy:_id}).populate("productId");
        if(!product)
        {
            res.code=404;
            throw new Error("Product not found");
        }

        const count=await Checkout.countDocuments({createdBy:_id});

        res.status(200).json({code:200,status:true,message:"Your checkouts",data:{product,count}})
    }
    catch(error)
    {
        next(error);
    }
}

module.exports={addToCheckOut,getMyCheckout}