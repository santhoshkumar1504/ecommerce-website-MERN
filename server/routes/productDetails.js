const express=require('express');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');
const { productDetailController } = require('../controllers');
const { idValidator } = require('../validators/category');
const validate = require('../validators/validate');
const router=express.Router();

// pass productId
router.post('/:id',isAuth,isAdmin,idValidator,validate,productDetailController.createProductDetail);

// pass productId
router.put('/:id',isAuth,isAdmin,idValidator,validate,productDetailController.updateProductDetail);

router.get('/:id',idValidator,validate,productDetailController.getProductDetails);

router.delete('/:id',isAuth,isAdmin,idValidator,validate,productDetailController.deleteProductDetail);

module.exports=router;