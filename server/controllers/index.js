const authController=require('./auth');
const userController=require('./user');
const categoryController=require('./category');
const orderController=require('./order');
const fileController=require('./file');
const productController=require('./product');

const reviewController=require('./review');
const productDetailController=require('./productDetails');

const checkOutController=require('./checkout');
const likedproductController=require('./likedproduct');
const paymentController=require('./paymentController')

module.exports={paymentController,authController,userController,categoryController,orderController,fileController,productController,reviewController,productDetailController,checkOutController,likedproductController}