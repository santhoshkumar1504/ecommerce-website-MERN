const express=require('express');
const isAuth = require('../middlewares/isAuth');
const { idValidator } = require('../validators/category');
const validate = require('../validators/validate');

const { likedproductController } = require('../controllers');
const { productValidator } = require('../validators');
const router=express.Router();

router.post('/addliked/:id',isAuth,idValidator,validate,likedproductController.addToLiked);

router.get('/',likedproductController.getMyLikedProducts);

router.post('/liked-product',isAuth,productValidator.likedProductValidator,validate,likedproductController.setLikedProducts);

router.get('/recommentations',isAuth,likedproductController.getLikedProduct);

module.exports=router;