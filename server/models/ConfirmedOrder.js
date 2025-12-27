const mongoose=require('mongoose');

const confirmOrderSchema=new mongoose.Schema({
    createdBy:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"users"
    },
    productDetail:{
        type:mongoose.Types.ObjectId,
        ref:"products",
        required:true,
    },
    orderDate:{
        type:Date,
        default:Date.now
    },
    orderQuantity:{
        type:Number,
        required:true,
        default:1
    },
    status:{
        type:String,
        requied:true,
        default:"Ordered"
    }
},{timestamps:true})

const ConfirmedOrder=mongoose.model("orders",confirmOrderSchema);

module.exports=ConfirmedOrder;