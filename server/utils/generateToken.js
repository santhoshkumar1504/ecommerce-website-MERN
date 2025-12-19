const jwt=require('jsonwebtoken');
const jwtSecret=process.env.JWT_SECRET_KEY;

const generateToken=(user)=>{
    const token=jwt.sign({id:user._id,name:user.name,email:user.email,role:user.role},
        jwtSecret,
        {
            expiresIn:'7d'
        }
    )
    return token;
}

module.exports=generateToken;