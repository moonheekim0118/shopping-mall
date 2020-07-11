const express = require('express');
const app = express();
const path = require('path');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const errorsController= require('./Controllers/errors');
const AdminRouter = require('./routes/admin');
const ShopRouter = require('./routes/shop');
const User = require('./Models/user');

app.set('view engine', 'ejs');
app.set('views', 'views'); // view engine 설정

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));


//admin 라우트 연결
// app.use('/admin',AdminRouter);
// app.use(ShopRouter);
app.use(errorsController.get404error);
app.use((req,res,next)=>{
    User.findById("5f095f794ad2413f8029df6e")
    .then(user=>{
        req.user=user; // 생성된 admin 유저 req에 등록해주기  
        next();
    })
    .catch(err=>console.log(err));
})

mongoose.connect("mongodb+srv://admin:admin@cluster0.9j2jo.mongodb.net/shop2?retryWrites=true&w=majority")
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