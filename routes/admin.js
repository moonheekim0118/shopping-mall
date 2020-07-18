const express =require('express');
const router =express.Router();
const AdminController= require('../Controllers/admin');
const AuthRouting = require('../middleware/is-Auth');
const { body } = require('express-validator/check');
// /admin 으로 시작하는 path 처리

router.get('/products', AuthRouting, AdminController.getProducts);

router.get('/add-product', AuthRouting, AdminController.getAddProduct);

router.post('/add-product', AuthRouting, AdminController.postAddProduct);

router.get('/edit-product/:productId', AuthRouting, AdminController.getEditProduct);

router.post('/edit-product',  AuthRouting,AdminController.postEditProduct);

router.post('/delete-product', AuthRouting,AdminController.postDeleteProduct);

module.exports=router;