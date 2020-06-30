// usermodel;
const Sequelize= require('sequelize');
const sequelize = require('../util/database');
// User Table 생성 
const User = sequelize.define('User', {
    id:{
        type: Sequelize.INTEGER,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    },
    name:{
        type: Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports=User;