const express =require('express');
const router =express.Router();
const shopController = require('../Controllers/shop');
const AuthRouting = require('../middleware/is-Auth');
const { body } = require('express-validator/check');


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

router.post('/addComment', AuthRouting.loginCheck, [
    body('title').isString().withMessage('제목을 올바르게 입력해주세요').
    isLength({min:3, max:15}).withMessage('제목은 최소 3글자, 최대 15글자 입니다.'),
    body('contents').isString().withMessage('내용을 올바르게 입력해주세요').
    isLength({min:10, max:50}).withMessage('내용은 최소 10글자여야 합니다.')
],shopController.postAddReview);

router.delete('/deleteReview/:productId', AuthRouting.loginCheck,
shopController.deleteReview);

module.exports=router;