const User = require("../models/User");
const Category=require("../models/Category");

const createCategory=async (req,res,next)=>{
    try{
        const {_id}=req.user;
        const {title,desc}=req.body;

        const userExists=await User.findById(_id);
        if(!userExists)
        {
            res.code=404;
            throw new Error("User not found");
        }

        const isCategoryExists=await Category.findOne({title});
        if(isCategoryExists)
        {
            res.code=400;
            throw new Error("Category already exists");
        }

        await Category.insertOne({title:title,desc:desc,createdBy:_id});

        res.status(201).json({code:201,status:true,message:"Category added successfully"});
    }
    catch(error)
    {
        next(error);
    }
}

const getAllCategory=async (req,res,next)=>{
    try{
        const {q,size,page,category}=req.query;
        const sizeNumber =parseInt(size) || 10;
        const pageNumber=parseInt(page) || 1;
        let query={};

        if(q)
        {
            const search=new RegExp(q,"i");
            query={
                $or:[{title:search}]
            };
        }

        if(category)
        {
           const search=new RegExp(category,"i");
            query={
                $or:[{title:search}]
            };
        }        

        const total=await Category.countDocuments(query);
        const pages=Math.ceil(total/sizeNumber);

        const categoryExist=await Category.find(query).skip((pageNumber-1) * (sizeNumber)).limit(sizeNumber);
        if(!categoryExist)
        {
            res.code=400;
            throw new Error("No category is available");
        }

        res.status(200).json({code:200,status:true,message:"All categories",data:{categoryExist,total,pages}});
    }
    catch(error)
    {
        next(error);
    }
}

const updateCategory=async (req,res,next)=>{
    try{
        const {id}=req.params;
        const {_id}=req.user;
        const {title,desc}=req.body;

        const category=await Category.findById(id);
        if(!category)
        {
            res.code=400;
            throw new Error("No category is available");
        }

        category.title=title ? title :category.title;
        category.desc=desc ?desc:category.desc;
        category.updatedBy=_id;
        await category.save();

        res.status(200).json({code:200,status:true,message:"Category updated successfully",data:{category}});
    }
    catch(error)
    {
        next(error);
    }
}


const getCategory=async (req,res,next)=>{
    try{
        const {id}=req.params;

        const category=await Category.findById(id);
        if(!category)
        {
            res.code=400;
            throw new Error("No category is available");
        }

        res.status(200).json({code:200,status:true,message:"Category get successfully",data:{category}});
    }
    catch(error)
    {
        next(error);
    }
}

const deleteCategory=async (req,res,next)=>{
    try{
        const {id}=req.params;
        const isCategoryExists=await Category.findById(id);
        if(!isCategoryExists)
        {
            res.code=400;
            throw new Error("Category not exists");
        }

        await Category.findByIdAndDelete(id);

        res.status(200).json({code:200,status:true,message:"Category deleted"});
    }
    catch(error)
    {
        next(error);
    }
}

module.exports={createCategory,getAllCategory,updateCategory,getCategory,deleteCategory};