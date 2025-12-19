const express=require('express');
const isAuth = require('../middlewares/isAuth');
const { idValidator } = require('../validators/category');
const validate = require('../validators/validate');
const { checkOutController } = require('../controllers');
const router=express.Router();

router.post('/addCheckout/:id',isAuth,idValidator,validate,checkOutController.addToCheckOut);

router.get('/',isAuth,checkOutController.getMyCheckout);

module.exports=router;