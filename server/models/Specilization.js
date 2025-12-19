const mongoose=require('mongoose');

const specilizationSchema=new mongoose.Schema(
    {
       feature:
        {heading:{
            type:String,
            required:true
        },
        body:{
            type:String,
            required:true
        }
    }
    ,
       productId:{
        type:mongoose.Types.ObjectId,
        ref:"products"
       }

    }
)

const Specilization=mongoose.model("specilizations",specilizationSchema);

module.exports=Specilization;