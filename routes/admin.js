const express =require('express');
const router =express.Router();
const AdminController= require('../Controllers/admin');
// /admin 으로 시작하는 path 처리

router.get('/products', AdminController.getProducts);

router.get('/add',AdminController.getAddProduct);

router.post('/add-item',AdminController.postAddProduct);

router.get('/edit', AdminController.getEditProduct);

router.post('/edit-item', AdminController.postEditProduct);

router.post('/delete-item',AdminController.postDeleteProduct);

module.exports=router;