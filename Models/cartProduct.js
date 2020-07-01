// join table for CART - PRODUCT (N:M)
const Sequelize= require('sequelize');
const sequelize= require('../util/database');

// CART에 들어갈 Product정보 
const CartProduct = sequelize.define('CartProduct', {
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

module.exports=CartProduct;