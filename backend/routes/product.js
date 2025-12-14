const express=require('express');
const router=express.Router();
const isAuth=require('../middlewares/isAuth');
const isAdmin=require('../middlewares/isAdmin');
const upload=require('../middlewares/file');
const { fileController, productController } = require('../controllers');
const { createProductValidator } = require('../validators/product');
const validate=require('../validators/validate');
const { idValidator } = require('../validators/category');

// form-data
router.post('/add-product',isAuth,isAdmin,upload.single("pic"),productController.createProduct);

router.put('/update-product/:id',isAuth,isAdmin,idValidator,validate,upload.single("pic"),productController.updateProduct);

router.delete('/:id',isAuth,isAdmin,idValidator,validate,productController.deleteProduct);

router.get('/',productController.getAllProduct);

router.get('/:id',productController.getOneProduct);

//file
router.post('/upload',isAuth,isAdmin,upload.single("pic"),fileController.uploadFile);

module.exports=router;

// check outs
// similarProducts