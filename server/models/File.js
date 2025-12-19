const mongoose=require('mongoose');

const fileSchema=new mongoose.Schema({
    fileName:{
        type:String,
        required:true,
        trim:true
    },
    addedBy:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"users"
    }
},{timestamps:true});

const File=mongoose.model("files",fileSchema);

module.exports=File;