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
    if(req.user){ // 로그인 된 경우 
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
    else{ //로그인 되지 않은 경우
        res.render('shop/cart', {
            path:'/cart',
            pageTitle: 'my Cart',
            products:[]
        })
    }
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
    // order가 없는 경우에도 renewOrder를 실행하면 null 에러가 뜬다.
    // 따라서 order가 있는 경우와 없는 경우를 나누어주었다. 
    if(req.user){
        let items;
        Order.findOne({'user.userId':req.user._id}) // findOne을 하지 않으면 배열 형태로 반환됨 한 유저당 하나의 order만을 생성함 
        .then(order=>{
             if(order){ //if there is order  
                return order.renewOrder(). // order renew 
                then(result=>{
                    order.populate('products.items.productId')
                    .execPopulate()
                    .then(orderObject=>{
                        items = orderObject.products.items; // 아이템에 order items 저장 
                    })
                })
            }
            else{ items=[]; } // items에 empty array 저장 
        })
        .then(result=>{ // rendering 
            res.render('shop/orders', {
                pageTitle:'My Order',
                path:'/orders',
                orders:items
            })
        }).catch(err=>console.log(err));
    }
    else{
        res.redirect('/login');
    }
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