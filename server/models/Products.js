const mongoose=require('mongoose');
const { v4: uuidv4 } = require("uuid");

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

    //specailzation
    specailzation:[
     {   detail:{
      type:mongoose.Types.ObjectId,
      ref:"specilizations",  
    }}],

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
  uuid: {
  type: String,
  unique: true,
  sparse: true
},

qrCode: {
  type: String,
  default: null
},
},{timestamps:true})

productSchema.pre("save", function () {

  if (!this.uuid) {
    this.uuid = uuidv4();
  }

});

productSchema.index({
  productName: "text",
  productDesc: "text",
  brand: "text"
});

productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ ratings: -1 });
productSchema.index({ createdAt: -1 });

//uuid for qrcode

const Product=mongoose.model("products",productSchema);

module.exports=Product;