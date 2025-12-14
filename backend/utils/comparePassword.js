const bcrypt=require('bcryptjs');

const comparePassword=(password,hashedpassword)=>{
    return bcrypt.compare(password,hashedpassword);
}

module.exports=comparePassword;