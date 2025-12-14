const File = require("../models/File");

const uploadFile=async(req,res,next)=>{
    try{
        const file=req.pic;
        const {_id}=req.user;

        if(!file)
        {
            res.code=400;
            throw new Error("File is not uploaded");
        }

        await File.insertOne({fileName:file,addedBy:_id});
        res.status(200).json({code:200,status:true,message:"Image uploaded successfully"});
        
    }
    catch(error)
    {
        next(error);
    }
}

module.exports={uploadFile};