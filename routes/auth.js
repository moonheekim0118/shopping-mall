const authController = require('../Controllers/auth');
const express =require('express');
const router =express.Router();

router.get('/login', authController.getLogin);

router.post('/login',authController.postLogin);

router.get('/signUp', authController.getSignUp);

router.post('/signUp',authController.postSignUp);

router.get('/Logout',authController.getLogout);

router.get('/new-password/:token', authController.getResetPage); // reset 입력 페이지 

router.post('/resetPassword', authController.postResetPage); // reset 

router.get('/new-password',authController.getNewPassword); // reset 할것인지 물어보는 페이지로

router.post('/new-password',authController.postNewPassword); // 이메일 발송 

module.exports=router;