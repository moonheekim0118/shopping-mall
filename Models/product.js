const mongoose =require('mongoose');
const database = require('../database');
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
    },

    reviews:{
        comments:[
          {
             user_id:Schema.Types.ObjectId,
             addedDate:Date,
             title:String,
            contents:String
           }
        ]
    }
});


ProductSchema.methods.addReview = function(title, contents, time, user_id){
    // 해당 유저 아이디를 가지고 있는 review가 있다면 아무것도 안하고 반환
    // 없다면 새로 등록해준다.
    const reviewIndex= this.reviews.comments.findIndex(cp=>{
        return cp.user_id.toString()==user_id.toString();
    });
    if(reviewIndex>=0){ return this.save();}
    const updatedReviews=[...this.reviews.comments];
    updatedReviews.push({user_id:user_id, addedDate:time, title:title, contents:contents});
    this.reviews.comments=updatedReviews;
    return this.save();
}

ProductSchema.methods.deleteReview = function(user_id){
    let updatedReviews = this.reviews.comments.filter(comment=>{
        return comment.user_id.toString() !== user_id.toString();
    });
    this.reviews.comments=updatedReviews;
    return this.save();
}

ProductSchema.index({title: 'text'}); // text index로 등록 
module.exports=mongoose.model('Product',ProductSchema);