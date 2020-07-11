const mongoose =require('mongoose');
const Schema = mongoose.Schema;
const Product = require('../Models/product');
const User= require('../Models/user');

const OrderSchema = new Schema({
   products: {
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
    ,user:{
        userId:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        name:{
            type:String,
            required:true}
    }
});

OrderSchema.methods.addOrder=function(userId){
    User.findById(userId)
    .then(user=>{
        this.order.products = user.cart.items;
    })
    return this.save();
}

OrderSchema.methods.removeOrder=function(product_id){
    let updatedOrderItem = this.products.items.filter(item=>{
        return item.productId.toString() !== product_id.toString();
    });
    this.products.items=updatedOrderItem;
    return this.save();
}

module.exports = mongoose.model('Order', OrderSchema);