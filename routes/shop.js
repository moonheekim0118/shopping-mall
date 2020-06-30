const express =require('express');
const router =express.Router();
const shopController = require('../Controllers/shop');
router.get('/product', shopController.getProducts);

router.get('/cart',shopController.getCart);

router.post('/add-to-cart',shopController.postAddToCart);

router.get('/order',shopController.getOrder);

router.post('/add-to-order',shopController.postAddToOrder);

module.exports=router;