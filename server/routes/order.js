const express=require('express');
const router=express.Router();
const isAuth=require('../middlewares/isAuth');
const isAdmin=require('../middlewares/isAdmin');
const validate=require('../validators/validate')
const { getAllOrders } = require('../controllers/order');
const { idValidator } = require('../validators/category');
const { orderController } = require('../controllers');

router.get('/',isAuth,isAdmin,getAllOrders);

router.post('/create-order/:id',isAuth,idValidator,validate,orderController.placeOrder);

router.put('/cancel-order/:id',isAuth,idValidator,validate,orderController.cancelOrder);

router.get('/user',isAuth,orderController.myOrders);

router.delete('/delete-order/:id',isAuth,isAdmin,idValidator,validate,orderController.deleteOrder);

//update status
router.put('/status/:id',isAuth,isAdmin,orderController.changeStatus);

module.exports=router;