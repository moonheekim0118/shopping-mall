const authController = require('../Controllers/auth');
const express =require('express');
const router =express.Router();

router.get('/login', authController.getLogin);

router.post('/login',authController.postLogin);

router.get('/signUp', authController.getSignUp);

router.post('/signUp',authController.postSignUp);

router.get('/Logout',authController.getLogout);
module.exports=router;