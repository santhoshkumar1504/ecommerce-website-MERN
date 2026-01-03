const express=require('express');
const { authController } = require('../controllers');
const validate = require('../validators/validate');
const isAuth=require('../middlewares/isAuth')
const { authValidator } = require('../validators');

const router=express.Router();

//Authendication

router.post('/signup',authValidator.signupValidator,validate,authController.signupController);

router.post('/signin',authValidator.signinValidator,validate,authController.signinController);

router.post('/logout',authController.logout);

//verify user
router.post('/verify-email-code', authController.verifyEmailCode);

router.post('/verify-email', authValidator.verifyEmailValidator, validate, authController.verifyEmail);


//password reset
router.post('/forgot-password-code',authValidator.emailValidator,validate,authController.forgotPasswordCode);

router.post('/reset-password',authValidator.resetPassValidator,validate,authController.resetPassword);

module.exports=router;