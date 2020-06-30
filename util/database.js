const Sequelize =require('sequelize');

// Connection Pool

const sequelize = new Sequelize('shopping_mall','root','asdf6405',{
    dialect:'mysql',
    host:'localhost',
    port:3360 });

module.exports=sequelize;