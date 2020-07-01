const express =require('express');
const router =express.Router();
const shopController = require('../Controllers/shop');

router.get('/', shopController.getIndex);

router.get('/products/:productId',shopController.getProductDetail); //product detail page 

router.get('/products', shopController.getProducts);

router.get('/cart',shopController.getCart);

router.post('/cart',shopController.postAddToCart);

router.get('/order',shopController.getOrder);

router.post('/add-to-order',shopController.postAddToOrder);

module.exports=router;