const {check}=require('express-validator');

const signupValidator=[
    check("name").notEmpty().withMessage("User name is required"),
    check("email").isEmail().withMessage("Invalid email").notEmpty().withMessage("Email is required"),
    check("password").isLength({min:6}).withMessage("Password should be length of 6 character").notEmpty().withMessage("Password is requied"),
    check("phone").notEmpty().withMessage("Phone number is required"),
    check("pincode").notEmpty().withMessage("Pincode is required")
]

const signinValidator=[
    check("email").isEmail().withMessage("Invalid email").notEmpty().withMessage("Email is required"),
    check("password").isLength({min:6}).withMessage("Password should be length of 6 character").notEmpty().withMessage("Password is required")
]

const emailValidator=[
    check("email").isEmail().withMessage("Invalid email").notEmpty().withMessage("Email is required")
]

const verifyEmailValidator=[
    check("email").isEmail().withMessage("Invalid email").notEmpty().withMessage("Email is required"),
    check("code").notEmpty().withMessage("Code is required")
]

const resetPassValidator=[
    check("email").isEmail().withMessage("Invalid email").notEmpty().withMessage("Email is required"),
    check("code").notEmpty().withMessage("Code is required")
]

const changePasswordValidator=[
    check("oldPass").notEmpty().withMessage("Old password is required"),
    check("newPass").notEmpty().withMessage("New password is required")
]

const updateProfileValidator=[
    check("address").notEmpty().withMessage("Address is required"),
    check("pincode").notEmpty().withMessage("Pincode is required").isLength(6).withMessage("Enter correct pin code"),
]

module.exports={signupValidator,signinValidator,emailValidator,verifyEmailValidator,resetPassValidator,changePasswordValidator,updateProfileValidator};