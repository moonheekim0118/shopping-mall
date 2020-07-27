const express =require('express');
const router =express.Router();
const AdminController= require('../Controllers/admin');
const AuthRouting = require('../middleware/is-Auth');
const { body } = require('express-validator/check');
// /admin 으로 시작하는 path 처리

router.get('/products', AuthRouting.sellerCheck, AdminController.getProducts);

router.get('/add-product', AuthRouting.sellerCheck, AdminController.getAddProduct);

router.post('/add-product', AuthRouting.sellerCheck,[
body('title').trim().isString().withMessage('Please enter correct title of your Product')
.isLength({min:2,max:15}).withMessage('title minimum 2 characters , maximum 15 characters')
,
body('price').trim().isNumeric().withMessage('Price must be only numbers')
,
body('description').isLength({min:5, max:100}).withMessage('Description minimum 5 characters , maximum 100 chracters')
] ,
AdminController.postAddProduct);

router.get('/edit-product/:productId', AuthRouting.sellerCheck, AdminController.getEditProduct);

router.post('/edit-product',  AuthRouting.sellerCheck,
[
body('title').trim().isString().withMessage('Please enter correct title of your Product')
.isLength({min:2,max:15}).withMessage('title minimum 2 characters , maximum 15 characters')
,
body('price').trim().isNumeric().withMessage('Price must be only numbers')
,
body('description').isLength({min:5, max:100}).withMessage('Description minimum 5 characters , maximum 100 chracters')
] ,
AdminController.postEditProduct);

router.delete('/products/:productId', AuthRouting.sellerCheck,AdminController.postDeleteProduct);

module.exports=router;