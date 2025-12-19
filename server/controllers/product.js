const Category = require("../models/Category");
const File = require("../models/File");
const Product = require("../models/Products");

const createProduct=async(req,res,next)=>{
    try{
        const {productName,category,price,quantity,productDesc,discountedPrice,brand}=req.body;
        if(!productName)
        {
            res.code=400;
            throw new Error("Product name is required");
        }
        if(!category)
        {
            res.code=400;
            throw new Error("Category is required");
        }
        if(!price)
        {
            res.code=400;
            throw new Error("Product price is required");
        }
        if(!quantity)
        {
            res.code=400;
            throw new Error("Product quantity is required");
        }
        if(!productDesc)
        {
            res.code=400;
            throw new Error("Product description is required");
        }
        if(!discountedPrice)
        {
            res.code=400;
            throw new Error("Product discounted price is required");
        }
        if(!brand)
        {
            res.code=400;
            throw new Error("Product brand is required");
        }
        const pic=req.pic;
        const {_id}=req.user;
        await File.insertOne({fileName:pic,addedBy:_id});

        const picture=await File.findOne({fileName:pic});
        if(!picture)
        {
            res.code=404;
            throw new Error("Picture not found");
        }

        const categoryFind=await Category.findOne({title:category});
        if(!categoryFind)
        {
            res.code=404;
            throw new Error("Category not found");
        }

        const categoryId=categoryFind._id;

        const pictureId=picture._id;

        const isExists=await Product.find({$and:[{productName:productName},{productDesc:productDesc},{category:categoryId},{price:price},{discountedPrice:discountedPrice},{createdBy:_id},{brand:brand},{quantity:quantity}]});        

        if(isExists.length!=0)
        {
            res.code=400;
            throw new Error("Product already exists");
        }

        await Product.insertOne({productName:productName,productDesc:productDesc,category:categoryId,price:price,discountedPrice:discountedPrice,pic:pictureId,createdBy:_id,brand:brand,quantity:quantity});

        res.status(200).json({code:200,status:true,message:"Product added successfully"});
    }
    catch(error)
    {
        next(error);
    }
}

const updateProduct=async(req,res,next)=>{
    try{
        const {productName,category,price,quantity,productDesc,discountedPrice,brand}=req.body;
        const pic=req.pic;
        const {_id}=req.user;
        const {id}=req.params;
        
        const product=await Product.findById(id);
        if(!product)
        {
            res.code=404;
            throw new Error("Product not found");
        }

        const categoryFind=await Category.findOne({title:category});
        if(!categoryFind)
        {
            res.code=404;
            throw new Error("Category not found");
        }

        const picId=product.pic;

        const picture=await File.findById(picId);
        picture.fileName=pic;
        await picture.save();

        const categoryId=categoryFind._id;
        product.productName=productName ?productName:product.productName;
        product.productDesc=productDesc ?productDesc:product.productDesc;
        product.price=price ?price:product.price;
        product.category=categoryId ?categoryId:product.category;

        product.discountedPrice=discountedPrice ?discountedPrice:product.discountedPrice;
        product.createdBy=_id ?_id:product.createdBy;
        product.brand=brand ?brand:product.brand;
        product.quantity=quantity ?quantity:product.quantity;

        await product.save();

        res.status(200).json({code:200,status:true,message:"Product updated successfully"});
    }
    catch(error)
    {
        next(error);
    }
}

const deleteProduct=async(req,res,next)=>{
    try{
        const {id}=req.params;
        
        const product=await Product.findById(id);
        if(!product)
        {
            res.code=404;
            throw new Error("Product not found");
        }

        await Product.findByIdAndDelete(id);

        res.status(200).json({code:200,status:true,message:"Product deleted successfully"});
    }
    catch(error)
    {
        next(error);
    }
}

const getAllProduct=async(req,res,next)=>{

    try{        
        const {q,size,page,name,brand,price,category,isFeatured}=req.query;
        const sizeNumber =parseInt(size) || 10;
        const pageNumber=parseInt(page) || 1;
        let query={};

        if(q)
        {
            const search=new RegExp(q,"i");
            query={
                $or:[{productName:search},
             { brand: search }]
            };
        }
        if(name)
        {
            const search=new RegExp(name,"i");
            query.name=search;
        }
        if(brand)
        {
            const search=new RegExp(brand,"i");
            query.brand=search;
        }
        if (price) {
            if (price.includes("-")) {
                const [min, max] = price.split("-").map(Number);
              query.price = { $gte: min, $lte: max };
             } else {
                 query.price = Number(price);
        }
        }

        if (isFeatured) {
              query.isFeatured = isFeatured === "true";
        }

        if(category)
        {
            const categoryRegex = new RegExp(category, "i");
            const categories = await Category.find({ title: categoryRegex }).select("_id");
            const categoryIds = categories.map(c => c._id);

           if (categoryIds.length > 0) {
                     query.category = { $in: categoryIds };
           } 
           else {
                      query.category = null; 
           }
        }

        const total=await Product.countDocuments(query);
        const pages=Math.ceil(total/sizeNumber);

        const productDetails=await Product.find(query).populate("pic").populate("category").populate("specailzation.detail").sort({"updatedAt":-1}).skip((pageNumber-1) * (sizeNumber)).limit(sizeNumber);

        if(!productDetails)
        {
            res.code=404;
            throw new Error("Product not found");
        }

        const count=await Product.countDocuments(query);

        res.status(200).json({code:200,status:true,message:"Product List",data:{productDetails,total,pages,count}});
    }
    catch(error)
    {
        next(error);
    }
}

const getOneProduct=async(req,res,next)=>{
    try{        
        const {id}=req.params;

        const product=await Product.findById(id).populate("category").populate("pic").populate("specailzation.detail");
        if(!product)
        {
            res.code=404;
            throw new Error("Product not found");
        }

        res.status(200).json({code:200,status:true,message:"Product List",data:{product}});
    }
    catch(error)
    {
        next(error);
    }
}


const setFeaturedProduct=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const product=await Product.findById(id);
        if(!product)
        {
            res.code=404;
            throw new Error("Product not found");
        }

        product.isFeatured=true;
        await product.save();

        res.status(200).json({code:200,status:true,message:"Product added to featured product"});
    }
    catch(error)
    {
        next(error);
    }
}

module.exports={createProduct,updateProduct,deleteProduct,getAllProduct,getOneProduct,setFeaturedProduct};