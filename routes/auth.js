const authController = require('../Controllers/auth');
const express =require('express');
const bcrypt = require('bcryptjs');
const router =express.Router();
const User = require('../Models/user');
const { body } = require('express-validator/check');

router.get('/login', authController.getLogin);

router.post('/login', 
[ 
    body('email').isEmail().withMessage('Please enter correct email'), // email 형태 아닐 경우  ,
    body('password').isLength({min:6, max:12}).withMessage('Password minimum 6 chracter and maximum 12character') // 비밀번호 length 벗어날 경우 
],authController.postLogin);


router.get('/signUp', authController.getSignUp);

router.post('/signUp', [
    body('email').isEmail().withMessage('Please enter correct email')
    .custom((value, {req})=>{
        return User.findOne({email:value})
        .then(user=>{
            if(user){
               return Promise.reject('Sorry! this is existing email '); 
            };
        }).catch(err=>{
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    }).normalizeEmail(),
    
    body('password').trim().isAlphanumeric().withMessage('Password only can be Characters and Numbers')
    .isLength({min:6, max:12}).withMessage('Password minimum 6 chracters , maximum 12characters'),
    body('confirmPassword').custom((value,{req})=>{
        if(value !== req.body.password){
           throw new Error('passwords did not match ');
        }
        else return true;
    }).trim()
],authController.postSignUp);

router.get('/Logout',authController.getLogout);

router.get('/new-password/:token', authController.getResetPage); // reset 입력 페이지 

router.post('/resetPassword', authController.postResetPage); // reset 

router.get('/new-password',authController.getNewPassword); // reset 할것인지 물어보는 페이지로

router.post('/new-password',authController.postNewPassword); // 이메일 발송 

router.get('/sell',authController.getSell);

router.post('/sell',authController.postSell);

router.post('/sell-delete',authController.postSellDelete);

module.exports=router;