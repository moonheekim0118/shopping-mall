const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    imageUrl:{
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
ProductSchema.index({title: 'text'}); // text index로 등록 
module.exports=mongoose.model('Product',ProductSchema);