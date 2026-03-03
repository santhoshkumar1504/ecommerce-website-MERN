const express=require('express');
const isAuth = require('../middlewares/isAuth');
const { idValidator } = require('../validators/category');
const validate = require('../validators/validate');
const { checkOutController } = require('../controllers');
const { deleteCheckout } = require('../controllers/checkout');
const router=express.Router();

router.post('/addCheckout/:id',isAuth,idValidator,validate,checkOutController.addToCheckOut);

router.get('/',isAuth,checkOutController.getMyCheckout);

router.delete("/:id", isAuth,checkOutController.deleteCheckout);

// routes/checkoutRoute.js
router.put("/:id", isAuth, checkOutController.updateCheckoutQuantity);

module.exports=router;