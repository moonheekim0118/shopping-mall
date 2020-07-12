# shopping-mall
udemy node js complete guide 강의 실습을 통해 구현하는 쇼핑몰 웹입니다. 

#### 📌2020 07 11
+ MySql -> NoSql 데이터 베이스 변경 , 개인프로젝트이기 때문에 몽고DB가 더 적절하다고 판단함

+ 수업에서는 한명의 User당 Order 스키마를 여러개 생성했는데 , 이럴경우 Order에 들어간 아이템들이 무의미하게 겹쳐질 수 있겠다 생각함, 따라서 한명의 User당 하나의 Order스키마만 갖고 Order에 들어갈 아이템 리스트를 Object Array로 변경

+ 기존의 Order에는 아이템의 모든 정보를 populate하여 저장했지만, 이 역시 Order에 들어갈 아이템이 많아지면 데이터베이스에 과부하가 올 수 있을 것이라 판단, 따라서 아이템의 ref인 Id값만 저장하고 getOrder 라우팅에서 populate를 이용해 해당 아이템의 정보를 추출하는 방향으로 바꿈


기존의 Order Model
> product에 해당 아이템의 모든 정보가 담기고 하나의 유저가 여러개의 Order 스키마를 가질 수 있다.
```javascript
const orderSchema = new Schema({
    products:[{
        product : {type: Object, required:true},
        quantity: {type: Number, required:true} 
    }]
    ,user:{
       userid:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
       },
       name:{
        type:String,
        required:true
       }
    }
})
```

변경 후 Order Model
> products.item.productId에 해당 아이템의 ref값이 담기고 유저 당 한개의 Order 스키마만 가질 수 있다.
```javascript
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
```


#### 📌2020 07 12
+ UI 수정

+ 사용자가 특정 아이템 스키마를 삭제했는데 Cart와 Order에 해당 아이템이 담겨 있는 버그 발견. null로 인식하여 getCart 라우팅과 getOrder 라우팅에서 에러 발생

+ 각각 User 모델과 Order 모델에서 renew 메서드 구현. 현재 Cart와 Order에 저장된 ProductId에 해당하는 모든 Product를 찾고, 해당 Product의 개수와 현재 Cart, Order에 담겨있는 아이템의 개수가 다를 경우 Cart와 Order를 갱신해주도록 함

renew메서드

```javascript
OrderSchema.methods.renewOrder=function(){
    const productIds = this.products.items.map(i=>{
        return i.productId;
    });
    const updatedOrderItems=[];
    return Product.find({'_id':productIds})
    .then(products=>{
        if(Object.keys(products).length < Object.keys(this.products.items).length){ // length가 다르다면 
            for( p of products){
                const qtity = this.products.items.find(i=>{
                    return i.productId.toString()===p._id.toString(); // id값이 같다면 
                }).quantity; // quantity 추출 
                if(qtity>0) updatedOrderItems.push({productId:p._id, quantity: qtity}); // quantity가 추출되었다면 
            }
        }
        this.products.items=updatedOrderItems;
        return this.save();
    })
```
