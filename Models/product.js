const mongoose =require('mongoose');
const Schema = mongoose.Schema;
const Product = require('../Models/product');
const Order = require('../Models/order');

const ProductSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    imgUrl:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true
    }
});

module.exports=mongoose.model('Product',ProductSchema);