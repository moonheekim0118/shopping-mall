const express =require('express');
const router =express.Router();
const shopController = require('../Controllers/shop');
const AuthRouting = require('../middleware/is-Auth');

router.get('/', shopController.getIndex);

router.get('/products/:productId',shopController.getProductDetail); //product detail page 

router.get('/products', shopController.getProducts);

router.get('/cart',shopController.getCart);

router.post('/cart',shopController.postAddToCart);

router.get('/orders', AuthRouting.loginCheck, shopController.getOrder);

router.post('/create-order',shopController.postAddToOrder);

router.delete('/cart/:productId',shopController.postDeleteCart);

router.delete('/order/:productId',shopController.postDeleteOrder);

module.exports=router;