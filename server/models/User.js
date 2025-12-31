const mongoose=require('mongoose');

const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            unique:true,
            trim:true,
            required:true
        },
        password:{
            type:String,
            required:true,
            trim:true
        },
        role:{
            type:Number,
            default:3,
            required:true
        },
        forgotPasswordCode:String,
        verificationCode:String,
        passexpiresAt:{
            type:Number,
            default:0
        },
        emailOtpExpiresAt:{
            type:Number,
            default:0
        },
        isVerified:{
            type:Boolean,
            default:false
        },
        address:{
            type:String,
            default:null
        },
        pincode:{
            type:Number
        },
        phone:{
            type:String,
            required:true
        },
        likedProducts:[
            {
                product:String,
                category:String
            }
        ]
    },
    {timestamps:true}
)

const User=mongoose.model("users",userSchema);

module.exports=User;
