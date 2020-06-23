const express = require('express');
const app = express();
const path = require('path');
const bodyParser= require('body-parser');

app.set('view engine', 'ejs');
app.set('views', 'views'); // view engine 설정

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
//admin 라우트 연결

//shop 라우트 연결

//404 라우트 연결

app.listen(3000);