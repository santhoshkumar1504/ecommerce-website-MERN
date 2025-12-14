const multer=require('multer');
const path=require('path');
const generateCode=require('../utils/generateCode');

const storage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'./uploads');
    },
    filename:(req,file,callback)=>{
        const originalFileName=file.originalname;
        const ext=path.extname(originalFileName);
        const FileName=originalFileName.replace(ext,'');
        const compressed=FileName.split(' ').join('_');
        const lowerCased=compressed.toLocaleLowerCase();
        const code=generateCode(12);
        const finalFileName=`${lowerCased}_${code}${ext}`;
        req.pic=finalFileName;
        callback(null,finalFileName);
    }
})

const upload=multer({
    storage,
    fileFilter:(req,file,callback)=>{
        const mimeType=file.mimetype;
        if(mimeType==="image/jpg"||mimeType==="image/jpeg"||mimeType==="image/png"||mimeType==="application/pdf")
        {
            callback(null,true);
        }
        else{
            callback(new Error("Only .jpg .png .jpeg .pdf is allowed"));
        }
    }
})

module.exports=upload;