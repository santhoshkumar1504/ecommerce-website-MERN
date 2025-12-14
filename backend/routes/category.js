const express=require('express');
const isAuth=require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');
const { categoryController } = require('../controllers');
const { categoryValidator } = require('../validators');
const validate=require('../validators/validate');
const { idValidator } = require('../validators/category');

const router=express.Router();

//create category
router.post('/create-category',isAuth,isAdmin,categoryValidator.createCategoryValidator,validate,categoryController.createCategory);

//view all category and search pagination
router.get('/',categoryController.getAllCategory);

//get one category
router.get('/:id',idValidator,validate,categoryController.getCategory);

//update one category
router.put('/:id',isAuth,isAdmin,idValidator,validate,categoryController.updateCategory);

//delete one category
router.delete('/:id',isAuth,isAdmin,idValidator,validate,categoryController.deleteCategory);

module.exports=router;