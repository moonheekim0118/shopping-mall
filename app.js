const express = require('express');
const app = express();
const path = require('path');
const bodyParser= require('body-parser');
const errorsController= require('./Controllers/errors');
const AdminRouter = require('./routes/admin');
const ShopRouter = require('./routes/shop');

const sequelize = require('./util/database');
const User = require('./Models/user');
const Product = require('./Models/product');

app.set('view engine', 'ejs');
app.set('views', 'views'); // view engine 설정

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use((req,res,next)=>{
    User.findByPk(1)
    .then(admin=>{
        req.user=admin;  // 등록된 admin 1 을 req.user에 저장함으로써 
                        //전체 애플리케이션에서 접근 가능하도록 만든다. 
        next();
    })
    .catch(err=>console.log(err));
})

//admin 라우트 연결
app.use('/admin',AdminRouter);
//app.use(ShopRouter);
app.use(errorsController.get404error);

/* association */
//user-cart (one to one)
//user-products( one to many ) 등록 
//user-order (one to many ) 
//cart-products (many to many)
//order-products (many to many)

// User- Product Association
// one to many relation
Product.belongsTo(User,{ constraints: true, onDelete:'CASCADE' });
User.hasMany(Product);

sequelize //{force:true}
.sync()
.then(result=>{
    return User.findByPk(1);
})
.then(user=>{
    if(!user){ // 1번 유저가 없다면 
        return User.create({name:'Admin1', email:'Admin@admin.com'});
    }
    else return Promise.resolve(user); 
})
.then(result=>{
    app.listen(3000);
})
.catch(err=>console.log(err));