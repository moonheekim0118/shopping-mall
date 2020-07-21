const User =require('../Models/user');
const Product= require('../Models/product');
const bcrypt = require('bcryptjs');
const api_info = require('../api_tokens');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const clientId=api_info.clientId;
const clientSecret=api_info.clientSecret;
const refreshToken=api_info.refreshToken;
const accessToken=api_info.accessToken;
const gmailAccount=api_info.gmailAccount;
const { validationResult } = require('express-validator/check');

const welcomeMessage=  `<h1>Thank you for signing in our shopping mall 'AMADOO' </h1>
<p> we hope you'll get bunch of great exprience in our shop</p>
<p> if you have any troubles while shopping, please let us know by this email! </p>
`
const sellerMessage=`<h1>You are a seller Now! </h1> thank you for registering our selling system. we hope you'll expreience great things.`;
const sendMail = async(to , subject, html) => { // gmail api 사용 
    const googleTransporter = await nodemailer.createTransport({
        host:'smtp.gmail.com',
        port: 465,
        secure:true,
        auth:{
            type:'OAuth2',
            user: gmailAccount,
            clientId:clientId,
            clientSecret: clientSecret,
            refreshToken:refreshToken,
            accessToken:accessToken,
            expires:3600
        }
    }),
    mailOptions = {
        from: 'Amadoo,<Amadoo@amadoo.com>',
        to,
        subject,
        html
    }
    try{
        await googleTransporter.sendMail(mailOptions);
        googleTransporter.close();
        console.log(`mail have sent to ${ to }`);
    } catch(err){
        console.log(err);
    }
}

exports.getLogin=(req,res,next)=>{
    res.render('auth/login', {
        path:'/login',
        pageTitle:'login',
        ErrorMessage:'',
        oldInput:{email:'', password:''},
        validationError:[]
    });
}

exports.getSignUp=(req,res,next)=>{
    res.render('auth/signUp', {
        path:'/signUp',
        pageTitle:'sign Up',
        ErrorMessage:'',
        oldInput : {email: '', password: ''},
        validationError: []
    })
}
exports.postSignUp=(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).render('auth/signUp',{
            path:'/signUp',
            pageTitle:'sign up',
            ErrorMessage : error.array()[0].msg,
            oldInput : {email: email, password: password},
            validationError: error.array()
        });
    }

    bcrypt.hash(password,12)
    .then(hashedPassword=>{ // hashed password로 변경
        const user = new User({
            email:email,
            password:hashedPassword,
            cart:{items:[]}
        }); // 새로운 User 데이터 저장 
        user.save()
        .then(result=>{
            res.redirect('/login');
            // sendMail(email,'welcome to Amadoo!', 
            // welcomeMessage);
        })
    }).catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}
exports.postLogin=(req,res,next)=>{
    const email = req.body.email;
    const password=req.body.password;
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).render('auth/login',{
            path:'/login',
            pageTitle:'login',
            ErrorMessage : error.array()[0].msg,
            oldInput : {email: email, password: password},
            validationError: error.array()
        });
    }
    User.findOne({email:email})
    .then(user=>{
        if(!user){
            return res.render('auth/login', {
                path:'/login',
                pageTitle:'login',
                ErrorMessage : '입력하신 email은 존재하지 않습니다.',
                oldInput : {email: email, password: password},
                validationError:[{param:'email'}]
            })
        }
        bcrypt.compare(password,user.password)
        .then(doMatch=>{
            if(!doMatch){
                res.render('auth/login', {
                    path:'/login',
                    pageTitle:'login',
                    ErrorMessage : '비밀번호가 일치하지 않습니다.',
                    oldInput : {email: email, password: password},
                    validationError:[{param:'password'}]
                });
            }
            else{
                req.session.isLoggedIn= true; // 로그인 되었음 
                if(user.Seller){ // Seller 정보 확인 
                    req.session.isSeller=true;
                }
                req.session.user = user; // 유저 정보 저장 
                req.session.save(err=>{ // 세션 저장 
                console.log(err);
                res.redirect('/'); // password 체크하는 flow 추가해줘야함 
                })
            }
        })
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}


exports.getLogout=(req,res,next)=>{ // 로그아웃 
    req.session.destroy();
    res.redirect('/');
}

exports.getNewPassword=(req,res,next)=>{ // password 재설정
    res.render('auth/new-password', {
        path:'/new-password',
        pageTitle:'resseting password'
    });
}

exports.postNewPassword=(req,res,next)=>{ // password 재설정 post
    // 토큰 값을 포함한 path를 email 로 발송해준후 리다이렉트.
    const email = req.body.email;
    crypto.randomBytes(32, (err,Buffer)=>{ // 토큰 생성 
        if(err){
            console.log(err);
            return res.redirect('/new-password');
        }
        const token = Buffer.toString('hex');
        User.findOne({email:email}) // 유저 찾기 
        .then(user=>{
            if(!user){
                return res.redirect('/reset');
            }
            user.resetToken=token; // 해당 유저에 토큰 및 만기일 저장 
            user.resetTokenExpiration= Date.now()+3600000;
            return user.save();
        })
        .then(result=>{
            res.redirect('/');
            return sendMail(email, 'Reset your password', `
            follow <a href="http://localhost:3000/new-password/${token}">this link</a> to reset your password `);
        })
        .catch(err=>{
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    })
}

exports.getResetPage=(req,res,next)=>{
    const token = req.params.token;
    User.findOne({resetToken:token, resetTokenExpiration:{$gt: Date.now()}})
    .then(user=>{
        if(!user){ res.redirect('/');}
        else{
            res.render('auth/reset-password', {
                path:'/reset-password',
                pageTitle:'reset password',
                userId:user._id,
                resetToken:token
            })
        }
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.postResetPage=(req,res,next)=>{
    const token  = req.body.token;
    const userId= req.body.userId;
    const password =req.body.password;
    let foundUser;
    User.findOne({_id:userId, resetToken:token, resetTokenExpiration:{$gt: Date.now()}})
    .then(user=>{
        if(!user){ // user 존재하지 않음 
            res.redirect('/');
        }
        else{
            foundUser = user;
            return bcrypt.hash(password,12)
            .then(hashedPassword=>{
                foundUser.password=hashedPassword;
                foundUser.resetToken=undefined;
                foundUser.resetTokenExpiration=undefined;
                return foundUser.save();
            })
        }
    })
    .then(result=>{
        res.redirect('/login');
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.getSell=(req,res,next)=>{
    res.render('shop/sell',{
        path:'/sell',
        pageTitle:'become a seller!'
    })
}

exports.postSell=(req,res,next)=>{
    const sellerName = req.body.sellerName;
    User.findById(req.user._id)
    .then(user=>{
        user.Seller=sellerName;
        return user.save();
    })
    .then(result=>{
        res.redirect('/admin/add-product');
            // sendMail(email,'you are a Seller now!', 
            // SellerMessage);
    })
    .catch(err=>next(err));
}

exports.postSellDelete=(req,res,next)=>{ // seller 취소 
    const password=req.body.password;
    User.findById(req.user._id)
    .then(user=>{
        return bcrypt.compare(password,user.password) // 비밀번호 확인 
        .then(doMatch=>{ 
            if(doMatch){ // 비밀번호 맞을 경우
                user.Seller=undefined;
                return user.save()
                .then(result=>{
                    return Product.deleteMany({userId:user._id}); // 해당 유저가 등록한 상품 모두 삭제 
                })
            }
        })
    })
    .then(result=>{
        res.redirect('/sell');
    })
}