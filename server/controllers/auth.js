const User = require('../models/User');
const cookie=require('cookie-parser');
const hashPassword = require('../utils/hashPassword');
const comparePassword=require('../utils/comparePassword');
const generateToken=require('../utils/generateToken');
const generateCode = require('../utils/generateCode');
const sendEmail = require('../utils/sendEmail');
const { node_env } = require('../config/keys');

const signupController=async (req,res,next)=>{
    try{
      const {name,email,password,role,phone,pincode}=req.body;

      const isEmailExists=await User.findOne({email:email});

      if(isEmailExists)
      {
        res.code=400;
        throw new Error("Email already exists");
      }

      const hashedPassword=await hashPassword(password);

      const user=new User({name:name,email:email,password:hashedPassword,role:role,phone:phone,pincode:pincode});
      await user.save();

    const token=generateToken(user);

    res.cookie('token',token,{
      httpOnly:true,
      secure:true,
      sameSite:node_env==='production' ? 'none' :'strict',
      maxAge:7*24*60*60*1000
    });

      res.status(200).json({code:200,status:true,message:"User signup successfully"});
    }
    catch(error)
    {
        next(error);
    }
}

const signinController=async (req,res,next)=>{
  try{
    const {email,password}=req.body;

    const user=await User.findOne({email:email});
    if(!user)
    {
      res.code=404;
      throw new Error("User not found");
    }

    const match=await comparePassword(password,user.password);
    if(!match)
    {
      res.code=400;
      throw new Error("Password doesn't match");
    }

    const token=generateToken(user);

    res.cookie('token',token,{
      httpOnly:true,
      secure:true,
      sameSite:node_env==='production' ? 'none' :'strict',
      maxAge:7*24*60*60*1000
    });

    res.status(200).json({code:200,status:true,message:"Login successful"});
  }
  catch(error)
  {
    next(error);
  }
}

const forgotPasswordCode=async (req,res,next)=>{
  try{
    const {email}=req.body;
    const user=await User.findOne({email});

    if(!user)
    {
      res.code=404;
      throw new Error("User not found");
    }

    const code=generateCode(6);

    await sendEmail({
      emailTo:user.email,
      subject:"Forgot password code",
      code,
      content:"recover the password",
      subContent:"Code"
    })

    user.forgotPasswordCode=code;
    await user.save();

    res.status(200).json({code:200,status:true,message:"Forgot code email is send successfully"});

  }
  catch(error)
  {
    next(error);
  }
}

const verifyEmailCode=async(req,res,next)=>{
  try{
    const {email}=req.user;

    const user=await User.findOne({email});
    if(!user)
    {
      res.code=404;
      throw new Error("User not found");
    }

    const isVerified=user.isVerified;

    if(isVerified)
    {
      res.code=400;
      throw new Error("Email already verified");
    }

    const code=generateCode(6);
    
    user.verificationCode=code;
    await user.save();

    await sendEmail({
      emailTo:user.email,
      subject:"Account verification code",
      code,
      content:"verify your account",
      subContent:"Code"
    })


    res.status(200).json({code:200,status:true,message:"Email verification code send successfully"});
  }
  catch(error)
  {
    next(error);
  }
}

const verifyEmail=async(req,res,next)=>{
  try{
    const {email}=req.user;
    const {code}=req.body;

    const user=await User.findOne({email});

    if(!user)
    {
      res.code=404;
      throw new Error("User not found");
    }

    if(code!=user.verificationCode)
    {
      res.code=400;
      throw new Error("Code is mismatched");
    }

    user.isVerified=true;
    user.verificationCode=null;
    await user.save();

    res.status(200).json({code:200,status:true,message:"Email verified successfully"});
    
  }
  catch(error)
  {
    next(error);
  }
}

const resetPassword=async (req,res,next)=>{
  try{
    const {email,code}=req.body;
    const user=await User.findOne({email});
    if(!user)
    {
      res.code=404;
      throw new Error("User not found");
    }

    if(code!==user.forgotPasswordCode)
    {
      res.code=400;
      throw new Error("Code doesn't match");
    }

    const tempPass=generateCode(6);

    await sendEmail({
      emailTo:user.email,
      subject:"Password reseted",
      code:tempPass,
      content:"to login with your account. Later you can change this password.",
      subContent:"Password"
    });

    const hashedPassword=await hashPassword(tempPass);

    user.password=hashedPassword;
    await user.save();

    res.status(200).json({code:200,status:true,message:"Password reseted successfully. Check the email."});
    
  }
  catch(error)
  {
    next(error);
  }
}

const logout=async(req,res,next)=>{
  try{
    res.clearCookie('token',
      {
        httpOnly:true,
        secure:true,
        sameSite:node_env =='production' ? 'none' : 'strict'
      }
    )

    res.status(200).json({code:200,status:true,message:"Logged Out"});
  }
  catch(error)
  {
    next(error);
  }
}

module.exports={signupController,signinController,forgotPasswordCode,verifyEmailCode,verifyEmail,resetPassword,logout};