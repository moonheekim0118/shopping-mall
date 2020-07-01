const Sequelize= require('sequelize');
const sequelize= require('../util/database');

const Cart = sequelize.define('Cart', { // CART 자체 구현
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull : false,
        primaryKey: true
    }
}
);

module.exports=Cart;