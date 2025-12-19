const User = require("../models/User");

const isAdmin=async (req,res,next)=>{
    try{
        const {_id}=req.user;

        const user=await User.findOne({_id});

        if(!user)
        {
            res.code=404;
            throw new Error("User not found");
        }

        if(user.role==1 || user.role==2)
        {
            next();
        }
        else{
            res.code=401;
            throw new Error("Unautherized credentials")
        }
    }
    catch(error)
    {
        next(error);
    }
}

module.exports=isAdmin;