const Product = require('../Models/product');
const Order = require('../Models/order');
const product = require('../Models/product');
const POST_PER_PAGE = 1;

const paginationModule = (pageNum,res,renderingPath, title, path)=>{
    let totalItems;    
    Product.find().countDocuments() // 전체 prouct개수 세기
    .then(itemsNum=>{ 
        totalItems=itemsNum;
        return Product.find() 
        .skip((pageNum-1)*POST_PER_PAGE) // 앞 페이지 product skip  
        .limit(POST_PER_PAGE) // 현재 페이지에 와야할 product 수 
    })
    .then(products=>{
        res.render(renderingPath, {
            pageTitle: title,
            path:path,
            prods: products,
            currentPage:pageNum, // 현재 페이지 
            hasNextPage: POST_PER_PAGE*pageNum < totalItems, // 다음 페이지가 있는가? 
            hasPreviousPage: pageNum>=2, // 이전 페이지가 있는가? 
            nextPage: pageNum+1, // 다음페이지 
            previousPage:pageNum-1, //이전페이지 
            lastPage: Math.ceil(totalItems/POST_PER_PAGE) //마지막 페이지 
        })
        })
    .catch(err =>console.log(err));
}
exports.getIndex=(req,res,next)=>{
    let pageNum=1;
    if(req.query.page){  pageNum=+req.query.page; }
    paginationModule(pageNum,res,'shop/index', 'welcome to Amadoo', '/');
}

exports.getProductDetail=(req,res,next)=>{
    const productId= req.params.productId;
    const page = req.query.page;
    console.log(productId);
    Product.findById(productId)
    .then(product=>{
        res.render('shop/product-detail', 
        {
            product:product,
            pageTitle:'DETAIL',
            path:'/products',
            page:page
        })
    })
    .catch(err=>console.log(err));
}

exports.getProducts=(req,res,next)=>{
    let pageNum=1;
    if(req.query.page){  pageNum=+req.query.page; }
    paginationModule(pageNum,res,'shop/product-list','product list','/products');
}

exports.getCart=(req,res,next)=>{
    if(req.user){ // 로그인 된 경우 
        req.user.renewCart().then(result=>{
            console.log(result);
            req.user.populate('cart.items.productId')
            .execPopulate()
            .then(user=>{
                const products = user.cart.items;
                res.render('shop/cart', {
                    path:'/cart',
                    pageTitle:'my Cart',
                    products:products
                })
            })
            .catch(err=>{
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
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
    if(req.user){
        const productId=req.body.productId;
        req.user.addToCart(productId)
       .then(result=>{
        res.redirect('/cart');
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
    }
    else{
        res.redirect('/login');
    }
}

// 카트에서 product 삭제 
exports.postDeleteCart=(req,res,next)=>{
    const productId=req.body.productId;
    req.user.removeFromCart(productId)
    .then(result=>{
        res.redirect('/cart');
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
    
}

exports.getOrder=(req,res,next)=>{ // Order페이지 띄우기 
    // order가 없는 경우에도 renewOrder를 실행하면 null 에러가 뜬다.
    // 따라서 order가 있는 경우와 없는 경우를 나누어주었다. 
    // 추후 refectoring 필요 
    Order.findOne({'user.userId':req.user._id})
    .then(order=>{
        if(order){
            order.renewOrder()
            .then(order=>{
                order.populate('products.items.productId')
                .execPopulate()
                .then(orderObject=>{
                    const items = orderObject.products.items;
                    res.render('shop/orders',{
                        path:'/orders',
                        pageTitle:'my Orders',
                        orders:items
                    })
                })
                .catch(err=>console.log(err));
            })
            .catch(err=>console.log(err));
        }
        else{ // order가 없는 경우 
            res.render('shop/orders',{
                path:'/orders',
                pageTitle:'my Orders',
                orders:[]
            })
        }
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.postAddToOrder=(req,res,next)=>{ // Cart에서 Order로 추가 
    Order.findOne({'user.userId':req.user._id})
    .then(order=>{
        if(!order){
            order=new Order({ // 해당  user의 order가 없다면 생성해주기 
                products: {items:[]},
                user:{userId:req.user._id}
            });
        }
        order.addOrder(req.user._id)
        .then(result=>{
            req.user.clearCart(); // 카트 비우기 
            res.redirect('/orders');
        })
    }).catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

// 특정 order 삭제하기 
// 'many'이면..get 할때 뒤에 s를 붙여야한다.
exports.postDeleteOrder=(req,res,next)=>{
    const product_id=req.body.productId;
    Order.findOne({'user.userId':req.user._id})
    .then(order=>{
        order.removeOrder(product_id)
        .then(result=>{
            res.redirect('/orders');
        })
    }).catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}
