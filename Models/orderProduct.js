// join table for ORDER - PRODUCT (N:M)
const Sequelize= require('sequelize');
const sequelize= require('../util/database');

// CART에 들어갈 Product정보 
const OrderProduct = sequelize.define('OrderProduct', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull : false,
        primaryKey: true
    },
    quantity:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
}
);

module.exports=OrderProduct;