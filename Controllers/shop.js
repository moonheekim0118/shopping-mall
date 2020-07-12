const Product = require('../Models/product');
const Order = require('../Models/order');
exports.getIndex=(req,res,next)=>{
    Product.find()
    .then(products=>{
        res.render('shop/index',{
            pageTitle:'welcome',
            path:'/',
            prods: products
        });
    })
    .catch(err =>console.log(err));
}

exports.getProductDetail=(req,res,next)=>{
    const productId= req.params.productId;
    console.log(productId);
    Product.findById(productId)
    .then(product=>{
        res.render('shop/product-detail', 
        {
            product:product,
            pageTitle:'DETAIL',
            path:'/admin/products'
        })
    })
    .catch(err=>console.log(err));
}

exports.getProducts=(req,res,next)=>{
    Product.find()
    .then(products=>{
        res.render('shop/product-list',{
            pageTitle:'products',
            path:'/products',
            prods: products
        });
    })
    .catch(err =>console.log(err));
}

exports.getCart=(req,res,next)=>{
    req.user.renewCart().then(result=>{
        req.user.populate('cart.items.productId')
        .execPopulate()
        .then(user=>{
            console.log(user);
            const products = user.cart.items;
            res.render('shop/cart', {
                path:'/cart',
                pageTitle:'my Cart',
                products:products
            })
        })
        .catch(err => console.log(err));
    });
}

exports.postAddToCart=(req,res,next)=>{
    const productId= req.body.productId;
    req.user.addToCart(productId)
    .then(result=>{
        console.log(result);
        res.redirect('/cart');
    })
    .catch(err=>console.log(err));
}

// 카트에서 product 삭제 
exports.postDeleteCart=(req,res,next)=>{
    const productId=req.body.productId;
    req.user.removeFromCart(productId)
    .then(result=>{
        res.redirect('/cart');
    })
    .catch(err=>console.log(err));
    
}

exports.getOrder=(req,res,next)=>{ // Order페이지 띄우기 
    let foundorder ; 
    Order.findOne({'user.userId':req.user._id}) // findOne을 하지 않으면 배열 형태로 반환됨 한 유저당 하나의 order만을 생성함 
    .then(order=>{
        foundorder=order;
        return order.renewOrder();
    })
    .then(result=>{
        foundorder.populate('products.items.productId') // productId기준으로 product 정보 끌어오기 
        .execPopulate()
        .then(order=>{
            const info = order.products.items;
            res.render('shop/orders', {
                pageTitle:'My Order',
                path:'/orders',
                orders:info
            })
        })
    }).catch(err=>console.log(err));
}

exports.postAddToOrder=(req,res,next)=>{ // Cart에서 Order로 추가 
    Order.findOne({'user.userId':req.user._id})
    .then(order=>{
        order.addOrder(req.user._id)
        .then(result=>{
            req.user.clearCart(); // 카트 비우기 
            res.redirect('/orders');
        })
    }).catch(err=>console.log(err));
    // req.user
    // .execPopulate()
    // .then(user=>{
    //     const products = user.cart.items.map(i=>{
    //         return {quantity:i.quantity, productId:i.productId};
    //     });
    //     const order = new Order({
    //         user:{
    //             userId: req.user._id,
    //             name:req.user.name
    //         },
    //         products:{ items:[]}
    //     });
    //     order.products.items= products;
    //     return order.save();
    // })
    // .then(result=>{
    //     req.user.clearCart(); // 카트 비우기 
    //     res.redirect('/');
    // }).catch(err=>console.log(err));
}

// 특정 order 삭제하기 
// 'many'이면..get 할때 뒤에 s를 붙여야한다.
exports.postDeleteOrder=(req,res,next)=>{
    const product_id=req.body.productId;
    Order.find({'user.userId':req.user._id})
    .then(order=>{
        order[0].removeOrder(product_id)
        .then(result=>{
            res.redirect('/orders');
        })
    }).catch(err=>console.log(err));
}