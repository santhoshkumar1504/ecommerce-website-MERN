const express=require('express');
const isAuth=require('../middlewares/isAuth');
const isAdmin=require('../middlewares/isAdmin');

const { userController} = require('../controllers');
const {authValidator}=require('../validators/index');
const { idValidator } = require('../validators/category');
const validate = require('../validators/validate');

const router=express.Router();

router.post('/send-message',userController.sendMessage);

router.get('/',isAuth,userController.getMydetails);

router.put('/update-profile',isAuth,authValidator.updateProfileValidator,validate,userController.updateMydetail);

router.get('/all-users',isAuth,isAdmin,userController.getAllUsers);

router.get('/all-users/:id',isAuth,isAdmin,idValidator,validate,userController.getOneUser);

router.put('/add-admin/:id',isAuth,isAdmin,idValidator,validate,userController.addAdmin);

//password change 
router.put('/change-password',isAuth,authValidator.changePasswordValidator,validate,userController.changePassword);

module.exports=router;