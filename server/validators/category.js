const { check, param } = require("express-validator");
const { default: mongoose } = require("mongoose");

const createCategoryValidator=[
    check("title").notEmpty().withMessage("Title is required")
]

const idValidator=[
    param("id").custom(async (id)=>{
        if(id && !mongoose.Types.ObjectId.isValid(id))
        {
            throw "Invalid category id"
        }
    })
]


module.exports={createCategoryValidator,idValidator};