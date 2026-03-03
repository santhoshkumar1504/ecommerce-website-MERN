const authRoute=require('./auth');
const userRoute=require('./user');
const categoryRoute=require('./category');
const orderRoute=require('./order');
const productRoute=require('./product');
const reviewRoute=require('./review');
const productDetailRoute=require('./productDetails');
const checkoutRoute=require('./checkout');
const likeRoute=require('./likedProducts');
const aiDescriptionRoute=require('./aidescription')
const paymentRoute=require('./paymentRoute')

module.exports={authRoute,userRoute,categoryRoute,orderRoute,productRoute,reviewRoute,productDetailRoute,checkoutRoute,likeRoute,aiDescriptionRoute, paymentRoute};