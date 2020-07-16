const express = require('express');
const app = express();
const path = require('path');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const errorsController= require('./Controllers/errors');
const AdminRouter = require('./routes/admin');
const ShopRouter = require('./routes/shop');
const AuthRouter = require('./routes/auth');
const User = require('./Models/user');

const session = require('express-session');
const MongoDBStore=require('connect-mongodb-session')(session);
const MONGODB_URI=require('./database'); // db URI 
const store = new MongoDBStore ({ // 연동할 db 설정 
    uri : MONGODB_URI,
    collection:'sessions'
});
app.set('view engine', 'ejs');
app.set('views', 'views'); // view engine 설정

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
app.use(session({secret:'my secret', resave:false, saveUninitialized:false, store:store})); // 세션 db 연동 

app.use((req,res,next)=>{
   if(req.session.user){ // session.user가 저장되었다면 == 로그인 되었다면 
       User.findOne(req.session.user._id) // 해당user찾기 
       .then(user=>{
           req.user = user; // req.user에 저장해서 전역에서 접근 가능하도록 
           next();
       })
       .catch(err=>console.log(err));
   }
   else{
       next();
   }
})

app.use((req,res,next)=>{
   res.locals.isAuthenticated = req.session.isLoggedIn;
   next();
});
//admin 라우트 연결
app.use('/admin',AdminRouter);
// app.use(ShopRouter);

app.use(ShopRouter);

app.use(AuthRouter);

app.use(errorsController.get404error);


mongoose.connect(MONGODB_URI)
.then(result=>{
    User.findOne().
    then(user=>{
        if(!user){ // 유저가 하나도 없으면 새로 admin 유저 생성해준다.
            const user= new User({
                name:'Admin',
                email:'admin@admin.com',
                cart:{ items:[]}
            });
            user.save();
        }
    })
    .catch(err=>console.log(err));
    app.listen(3000);
}).catch(err=>console.log(err));