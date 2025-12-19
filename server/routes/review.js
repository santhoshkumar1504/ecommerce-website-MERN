const express=require('express');
const router=express.Router();
const isAuth=require('../middlewares/isAuth');
const {productValidator}=require('../validators');
const validate = require('../validators/validate');
const {reviewController}=require('../controllers');

router.post('/create-review/:id',isAuth,productValidator.createReviewValidator,validate,reviewController.createReview);

module.exports=router;