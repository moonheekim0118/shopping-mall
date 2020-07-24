const express =require('express');
const router =express.Router();
const shopController = require('../Controllers/shop');
const AuthRouting = require('../middleware/is-Auth');

router.get('/', shopController.getIndex);

router.get('/products/:productId',shopController.getProductDetail); //product detail page 

router.get('/products', shopController.getProducts);

router.get('/cart',shopController.getCart);

router.post('/cart',AuthRouting.loginCheck ,shopController.postAddToCart);

router.get('/orders', AuthRouting.loginCheck, shopController.getOrder);

router.post('/create-order',AuthRouting.loginCheck,shopController.postAddToOrder);

router.delete('/cart/:productId',AuthRouting.loginCheck,shopController.postDeleteCart);

router.delete('/order/:productId',AuthRouting.loginCheck,shopController.postDeleteOrder);

router.get('/cart-qty/:productId',AuthRouting.loginCheck,shopController.cartChangeQty);

router.get('/order-qty/:productId',AuthRouting.loginCheck,shopController.orderChangeQty);

router.get('/cart-orderd/:productId',AuthRouting.loginCheck, shopController.cartOrderd);

router.get('/search', shopController.getSearch);

module.exports=router;