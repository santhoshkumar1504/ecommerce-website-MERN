const mongoose=require('mongoose');

const likedProductSchema=new mongoose.Schema({
    productId:{
        type:mongoose.Types.ObjectId,
        ref:"products",
        required:true
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"users",
        required:true
    }
});


const Likedproduct=mongoose.model("likedproducts",likedProductSchema);

module.exports=Likedproduct;