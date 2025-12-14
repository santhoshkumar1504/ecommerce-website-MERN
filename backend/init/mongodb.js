const mongoose=require('mongoose');
const {connectionUrl}=require('../config/keys');

const dbConnect=async ()=>{
    try{
        await mongoose.connect(connectionUrl);
        console.log("Database Connected Successfully");
    }
    catch(error)
    {
        console.log(error.message);
    }
}

module.exports=dbConnect;