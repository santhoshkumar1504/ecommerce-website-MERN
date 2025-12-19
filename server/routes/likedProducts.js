const express=require('express');
const isAuth = require('../middlewares/isAuth');
const { idValidator } = require('../validators/category');
const validate = require('../validators/validate');

const { likedproductController } = require('../controllers');
const router=express.Router();

router.post('/addliked/:id',isAuth,idValidator,validate,likedproductController.addToLiked);

router.get('/',isAuth,likedproductController.getMyLikedProducts);

module.exports=router;