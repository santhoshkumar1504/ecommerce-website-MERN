const { senderEmail } = require("../config/keys");
const User = require("../models/User");
const comparePassword = require("../utils/comparePassword");
const sendNodification = require("../utils/emailNotification");
const hashPassword = require("../utils/hashPassword");

const getMydetails=async (req,res,next)=>{
    try{
    const {_id}=req.user;
    const isUser=await User.findById(_id).select("-password -forgotPasswordCode -verificationCode");

    if(!isUser)
    {
        res.code=404;
        throw new Error("User not found");
    }

    res.status(200).json({code:200,status:true,message:"Success",data:{isUser}});

    }

    catch(error)
    {
        next(error);
    }
    
}

const updateMydetail=async (req,res,next)=>{
    try{
    const {_id}=req.user;
    
    const {name,email,address,phone,pincode}=req.body;

    const isUser=await User.findById(_id).select("-password -forgotPasswordCode -verificationCode -role");

    if(!isUser)
    {
        res.code=404;
        throw new Error("User not found");
    }


    isUser.name=name ? name :isUser.name;
    isUser.email=email ? email :isUser.email;
    isUser.address=address ? address :isUser.address;
    isUser.pincode=pincode ? pincode :isUser.pincode;
    isUser.phone=phone ?phone:isUser.phone;

    if(email)
    {
        isUser.isVerified=false;
    }

    await isUser.save();

    res.status(200).json({code:200,status:true,message:"Profile updated successfully",data:{isUser}});
       
    }
    catch(error)
    {
        next(error);
    }
}

const getAllUsers=async(req,res,next)=>{
    try{
        const user=await User.find({}).select("-password -forgotPasswordCode -verificationCode");
        if(!user)
        {
            res.code=400;
            throw new Error("User not found");
        }

        const count=await User.countDocuments({});

        res.status(200).json({code:200,status:true,message:"All user details",data:{user,count}});
    }
    catch(error)
    {
        next(error);
    }
}

const getOneUser=async(req,res,next)=>{
    try{
        const {id}=req.params;

        const user=await User.findById(id).select("-forgotPasswordCode -verificationCode");
        if(!user)
        {
            res.code=404;
            throw new Error("User not found");
        }

         res.status(200).json({code:200,status:true,message:"User detail",data:{user}});
       
    }
    catch(error)
    {
        next(error);
    }
}

const changePassword=async(req,res,next)=>{
    try{
        const {_id}=req.user;
        
        const {oldPass,newPass}=req.body;
        const user=await User.findById({_id});

        if(!user)
        {
            res.code=404;
            throw new Error("User not found");
        }

        if(newPass==oldPass)
        {
            res.code=400;
            throw new Error("Same password used");
        }

        const match=await comparePassword(oldPass,user.password);

        if(!match)
        {
            res.code=400;
            throw new Error("Password mismatched");
        }

        const newHashedPass=await hashPassword(newPass);
        user.password=newHashedPass;
        await user.save();

        res.status(200).json({code:200,status:true,message:"Password changed successfully"});

    }
    catch(error)
    {
        next(error);
    }
}

const addAdmin=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const {role}=req.body;
        const user=await User.findById(id);

        if(!user)
        {
            res.code=404;
            throw new Error("User not found");
        }

        if(!user.isVerified)
        {
            res.code=400;
            throw new Error("User is not verified");
        }

        if(user.role==1 ||user.role==2)
        {
            res.code=400;
            throw new Error("User is already admin");
        }

        user.role=role ? role :user.role;
        await user.save();

        res.status(200).json({code:200,status:true,message:"User role changed"});

    }
    catch(error)
    {
        next(error);
    }
}

const sendMessage=async(req,res,next)=>{
    try{
        const {name,email,phone,message}=req.body;
        if(!name)
        {
            res.code=400;
            throw new Error("Name is required");
        }
        if(!email)
        {
            res.code=400;
            throw new Error("Email is required");
        }
        if(!phone)
        {
            res.code=400;
            throw new Error("Phone Number is required");
        }
        if(!message)
        {
            res.code=400;
            throw new Error("Message is required");
        }

  await sendNodification({
  emailTo: senderEmail, // admin email
  subject: "New Customer Contact Message – ShopNEXA",
  head: `
    <h2 style="color:#2c3e50;">New Customer Contact Message</h2>
    <p>You have received a new message from a customer via the ShopNEXA contact form.</p>
    <hr />
  `,
  body: `
    <p><strong>Customer Name:</strong> ${name}</p>
    <p><strong>Customer Email:</strong> ${email}</p>
    <p><strong>Contact Number:</strong> ${phone || "Not provided"}</p>
    <p><strong>Message:</strong></p>
    <p style="background:#f4f4f4;padding:10px;border-radius:5px;">
      ${message}
    </p>
    <br />
    <p>Please respond to the customer as soon as possible.</p>
    <br />
    <p style="font-size:12px;color:#777;">
      This message was sent from the ShopNEXA contact form.
    </p>
  `
});

res.status(200).json({code:200,status:true,message:"message sended"});

    }
    catch(error)
    {
        next(error);
    }
}

module.exports={getMydetails,updateMydetail,getAllUsers,getOneUser,changePassword,addAdmin,sendMessage}