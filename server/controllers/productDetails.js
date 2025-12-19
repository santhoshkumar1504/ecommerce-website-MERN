const Product = require("../models/Products");
const Specilization = require("../models/Specilization");

const createProductDetail=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const product=await Product.findById(id);
        if(!product)
        {
            res.code=404;
            throw new Error("Product not exists");
        }
        const details=req.body;
        if(!details)
        {
            res.code=400;
            throw new Error("Detail is required");
        }

        await Specilization.insertOne({feature:details,productId:id});

        const created=await Specilization.findOne({feature:details});
        if(!created)
        {
            res.code=404;
            throw new Error("Detail is not found");
        }

        product.specailzation=[...product.specailzation,{detail:created._id}];
        await product.save();

        res.status(200).json({code:200,status:true,message:"Details added successfully"});
    }
    catch(error)
    {
        next(error);
    }
}

const updateProductDetail=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const {heading,body}=req.body;

        const detail=await Specilization.findById(id);
        if(!detail)
        {
            res.code=404;
            throw new Error("Detail not found");
        }

        detail.feature.heading=heading ?heading :detail.feature.heading;
        detail.feature.body=body ?body :detail.feature.body;
        await detail.save();

        res.status(200).json({code:200,status:true,message:"Details added successfully",data:{detail}});
    }
    catch(error)
    {
        next(error);
    }
}


const getProductDetails=async (req,res,next)=>{
    try{
        const {id}=req.params;
        const details=await Specilization.find({productId:id});
        if(!details)
        {
            res.code=400;
            throw new Error("Details not found");
        }

        res.status(200).json({code:200,status:true,message:"Product details",data:{details}});
    }
    catch(error)
    {
        next(error);
    }
}

const deleteProductDetail=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const detail=await Specilization.findById(id);
        if(!detail)
        {
            res.code=400;
            throw new Error("Detail is not found");
        }
        await Specilization.findByIdAndDelete(id);

        res.status(200).json({code:200,status:true,message:"Product Detail is deleted"});
    }
    catch(error)
    {
        next(error);
    }
}

module.exports={createProductDetail,updateProductDetail,getProductDetails,deleteProductDetail}