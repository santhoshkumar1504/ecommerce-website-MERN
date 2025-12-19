const mongoose=require('mongoose');

const categorySchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    desc:{
        type:String
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"users"
    },
    updatedBy:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    }
},{timestamps:true});

const Category=mongoose.model("categories",categorySchema);

module.exports=Category;