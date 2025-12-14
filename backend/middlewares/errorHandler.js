const errorHandler=(error,req,res,next)=>{
    code=res.code ? res.code :500;
    res.status(code).json({code:code,status:false,messsage:error.messsage,stack:error.stack});
}

module.exports=errorHandler;