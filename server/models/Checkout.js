const mongoose=require('mongoose');

const checkoutSchema=new mongoose.Schema(
    {
        productId:{
            type:mongoose.Types.ObjectId,
            ref:"products",
            required:true
        },
        createdBy:{
            type:mongoose.Types.ObjectId,
            ref:"users",
            required:true
        },
        quantity:Number
    },{timestamps:true}
);


const Checkout=mongoose.model("checkouts",checkoutSchema);

module.exports=Checkout;