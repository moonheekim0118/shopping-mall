// login 되어있는지 확인해주는 미들웨어


// admin post 라우팅에서 먼저 실행된다.
exports.sellerCheck =(req,res,next)=>{
    if(!req.session.isLoggedIn){
        return res.redirect('/login');
    }
    else if(!req.user.Seller){
        return res.redirect('/sell');
    }
    next();
}

exports.loginCheck = (req,res,next)=>{
    if(!req.session.isLoggedIn){
        return res.redirect('/login');
    }
    next();
}


