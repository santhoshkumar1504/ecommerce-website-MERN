const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    productName:{
        type:String,
        required:true,
        trim:true
    },
    category:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"categories"
    },
    price:{
        type:Number,
        required:true,
        default:0
    },
    quantity:{
        type:Number,
        required:true,
        default:1
    },
    productDesc:{
        type:String,
        required:true
    },
    pic:{
        type:mongoose.Types.ObjectId,
        ref:"files"
    },
    discountedPrice:{
        type:Number,
        default:0
    },
    brand:{
        type:String
    },

    //ratings
    ratings:{
        type:Number,
        default:0
    },
    numReview:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Types.ObjectId,
                ref:"users"
            },
            name:String,
            rating:Number,
            comment:String,
            createdAt:{
                type:Date,
                default:Date.now
            }
        }
    ],

    //isFeatured for showing trending
    isFeatured:{
        type:Boolean,
        default:false
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },
    // qrCode:{
    //     type:String
    // }
},{timestamps:true})

//uuid for qrcode
//product detail like size and brands in array

const Product=mongoose.model("products",productSchema);

module.exports=Product;