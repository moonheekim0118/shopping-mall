const mongoose =require('mongoose');
const Schema = mongoose.Schema;
const Product = require('../Models/product');
const Order = require('../Models/order');
const userSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
     },
     cart:{
        items:[
            {
                productId:{
                    type:Schema.Types.ObjectId,
                    ref:'Product',
                    required:true
                },
                quantity:{
                    type:Number,
                    required:true
                }
            }
        ] 
     }
});

module.exports= mongoose.model('User', userSchema);