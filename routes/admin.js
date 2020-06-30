const express =require('express');
const router =express.Router();
const AdminController= require('../Controllers/admin');
// /admin 으로 시작하는 path 처리

router.get('/products', AdminController.getProducts);

router.get('/add-product',AdminController.getAddProduct);

router.post('/add-product',AdminController.postAddProduct);

router.get('/edit-product', AdminController.getEditProduct);

router.post('/edit-product', AdminController.postEditProduct);

router.post('/delete-product',AdminController.postDeleteProduct);

module.exports=router;