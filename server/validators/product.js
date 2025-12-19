const {check}=require('express-validator');

const createProductValidator=[
    check("productName").notEmpty().withMessage("Product name is required"),
    check("category").notEmpty().withMessage("Category is required"),
    check("price").notEmpty().withMessage("Price is required"),
    check("quantity").notEmpty().withMessage("Quantity is required"),
    check("productDesc").notEmpty().withMessage("Product Description is required"),
    check("discountedPrice").notEmpty().withMessage(" Discounted Price is required"),
    check("brand").notEmpty().withMessage("Brand name is required")
]

const createReviewValidator=[
    check("name").notEmpty().withMessage("Name is required"),
    check("rating").notEmpty().withMessage("Rating is required"),
    check("comment").notEmpty().withMessage("Comment is required")
]

module.exports={createProductValidator,createReviewValidator};