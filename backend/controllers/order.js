const ConfirmedOrder = require("../models/ConfirmedOrder");
const Product = require("../models/Products");
const User = require("../models/User");
const sendNodification = require("../utils/emailNotification");

const getAllOrders=async (req,res,next)=>{
    try{
        const {q,size,page,status}=req.query;
        const sizeNumber =parseInt(size) || 10;
        const pageNumber=parseInt(page) || 1;
        let query={};

        if(q)
        {
            const search=new RegExp(q,"i");
            query={
                $or:[{status:search}]
            };
        }

        if(status)
        {
            query={...query,category}
        }

        const total=await ConfirmedOrder.countDocuments(query);
        const pages=Math.ceil(total/sizeNumber);

        const orders=await ConfirmedOrder.find(query).populate("createdBy","-password -forgotPasswordCode -verificationCode").populate("productDetail").sort({"orderDate":-1}).skip((pageNumber-1) * (sizeNumber)).limit(sizeNumber);

        if(!orders)
        {
            res.code=400;
            throw new Error("No orders placed");
        }

        res.status(200).json({code:200,status:true,message:"All orders",data:{orders,total,pages}});
    }
    catch(error)
    {
        next(error);
    }
}

const placeOrder=async (req,res,next)=>{
    try{
        const {_id}=req.user; 
        const {id}=req.params;
        const {quantity}=req.body;

        const user=await User.findById(_id).select("-password -forgotPasswordCode -verificationCode");
        const isProductExists=await Product.findById(id).select("-ratings -numReview -reviews");

        if(!isProductExists)
        {
            res.code=400;
            throw new Error("Product doesn't exists");
        }

        if(isProductExists.quantity==0)
        {
            res.code=400;
            throw new Error("Product is not available");
        }

        if(user.isVerified==false)
        {
            res.code=401;
            throw new Error("User not verified");
        }

        await ConfirmedOrder.insertOne({createdBy:user._id,productDetail:isProductExists._id,orderQuantity:quantity});

        await sendNodification({
            emailTo:user.id,
            subject:"Order Placed Successfully",
            head:"Your order is confirmed and placed successfully",
            body:"Will we update status of the order on our platform. Thank you"
        })

        res.status(200).json({code:200,status:true,message:"Order placed"});
    }
    catch(error)
    {
        next(error);
    }
}

const myOrders=async (req,res,next)=>{
    try{
       const {_id}=req.user;

       const order=await ConfirmedOrder.findOne({createdBy:_id}).populate("productDetail");

       if(!order)
       {
        res.code=400;
        throw new Error("Order not exists");
       }

        res.status(200).json({code:200,status:true,message:"My orders",data:{order}});
    }
    catch(error)
    {
        next(error);
    }   
}

const cancelOrder=async (req,res,next)=>{
    try{
    const {id}=req.params;
    const {_id}=req.user;

    const order=await ConfirmedOrder.findById(id).populate("productDetail").populate("createdBy");
    if(!order)
    {
        res.code=400;
        throw new Error("Order not exists");
    }

    const user=await User.findById(_id).select("-password -forgotPasswordCode -verificationCode");

    if(!user)
    {
        res.code=404;
        throw new Error("User not found");
    }

    const emailto=user.email;
    const productDetail=`The product ${order.productDetail.productName} placed by the user ${order.createdBy.email} is now cancelled`

    if(emailto)
    {
          await sendNodification({
            emailTo:emailto,
            subject:"Order Cancel",
            head:productDetail,
            body:"Thank you"
        })      
    }

    order.status="Order cancelled";
    await order.save();

    res.status(200).json({code:200,status:true,message:"Order Cancelled"});
    }
    catch(error)
    {
        next(error);
    }

}

const deleteOrder=async (req,res,next)=>{
    try{
        const {id}=req.params;
        const order=await ConfirmedOrder.findById(id);

        if(!order)
        {
            res.code=400;
            throw new Error("No orders placed");
        }

        if(order.status!="Order cancelled")
        {
            res.code=400;
            throw new Error("Order not cancelled");
        }

        await ConfirmedOrder.findByIdAndDelete(id);

        res.status(200).json({code:200,status:true,message:"Order deleted"});
    }
    catch(error)
    {
        next(error);
    }
}

const changeStatus=async (req,res,next)=>{
    try{
        const {id}=req.params;
        const {status}=req.body;
        const order=await ConfirmedOrder.findById(id);

        if(!order)
        {
            res.code=400;
            throw new Error("Order is not exist");
        }

        order.status=status ? status :order.status;
        await order.save();

        res.status(200).json({code:200,status:true,message:"Status updated successfully"});
    }
    catch(error)
    {
        next(error);
    }
}

module.exports={getAllOrders,placeOrder,myOrders,cancelOrder,deleteOrder,changeStatus};