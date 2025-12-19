const {validationResult}=require('express-validator');

const validate=(req,res,next)=>{
    // validate result
    const errors=validationResult(req);
    mappedErrors={};

    if(Object.keys(errors.errors).length==0)
    {
        next();
    }
    else{
        // map the validation errors
        errors.errors.map((error)=>{
        mappedErrors[error.path]=error.msg;
        })

        res.status(400).json(mappedErrors);
    }
    

}

module.exports=validate;