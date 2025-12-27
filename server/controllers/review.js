const Product=require('../models/Products');

const createReview=async (req,res,next)=>{
    try{
        const {id}=req.params;
        const {userId}=req.user;
        const {name,rating,comment}=req.body;
        const product=await Product.findById(id);        
        if(!product)
        {
            res.code=404;
            throw new Error("Product is not found");
        }
        for(let i=0;i<product.reviews.length;i++)
        {
        if(product.reviews[i].user==userId)
        {
            res.code=400;
            throw new Error("You reviewed already");
        }
        }
        
        const oldNumReview = product.numReview;
        const oldRating = product.ratings;

        product.numReview = oldNumReview + 1;
        product.ratings =(oldRating * oldNumReview + rating) / product.numReview;

        product.reviews=[...product.reviews,{user:userId,name:name,rating:rating,comment:comment}];
        await product.save();
        
        res.status(200).json({code:200,status:true,message:"Review added successfully"});
    }
    catch(error)
    {
        next(error);
    }
}

module.exports={createReview};