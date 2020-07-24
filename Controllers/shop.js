const Product = require('../Models/product');
const Order = require('../Models/order');
const { validationResult } = require('express-validator/check');
const POST_PER_PAGE = 1;

exports.getIndex=(req,res,next)=>{
    let pageNum=1;
    if(req.query.page){  pageNum=+req.query.page; }
    let totalItems;    
    Product.find().countDocuments() // 전체 prouct개수 세기
    .then(itemsNum=>{ 
        totalItems=itemsNum;
        return Product.find() 
        .skip((pageNum-1)*POST_PER_PAGE) // 앞 페이지 product skip  
        .limit(POST_PER_PAGE) // 현재 페이지에 와야할 product 수 
    })
    .then(products=>{
        res.render('shop/index', {
            pageTitle: 'welcome to Amadoo',
            path:'/',
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
            page:page,
            user_id:req.user._id.toString()
        })
    })
    .catch(err=>console.log(err));
}

exports.getProducts=(req,res,next)=>{
    let pageNum=1;
    if(req.query.page){  pageNum=+req.query.page; }
    let totalItems;    
    Product.find().countDocuments() // 전체 prouct개수 세기
    .then(itemsNum=>{ 
        totalItems=itemsNum;
        return Product.find() 
        .skip((pageNum-1)*POST_PER_PAGE) // 앞 페이지 product skip  
        .limit(POST_PER_PAGE) // 현재 페이지에 와야할 product 수 
    })
    .then(products=>{
        res.render('shop/product-list', {
            pageTitle: 'product list',
            path:'/products',
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
    const productId=req.body.productId;
    req.user.addToCart(productId)
   .then(result=>{
    res.redirect('/');
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
});
}

// 카트에서 product 삭제 
exports.postDeleteCart=(req,res,next)=>{
    const productId=req.params.productId;
    req.user.removeFromCart(productId)
    .then(result=>{
        res.status(200).json({message:'succeed'});
    })
    .catch(err=>{
        res.status(500).json({message:'fail'});
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
        order.addOrder(req.user.cart.items)
        .then(result=>{
            req.user.adjustCart(); // 카트 비우기 
            res.redirect('/orders');
        })
    }).catch(err=>{
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

// 특정 order 삭제하기 
exports.postDeleteOrder=(req,res,next)=>{
    const productId=req.params.productId;
    Order.findOne({'user.userId':req.user._id})
    .then(order=>{
        return order.removeOrder(productId)
    })
    .then(result=>{
        res.status(200).json({message:'succeed'});
    })
    .catch(err=>{
       res.status(500).json({message:'fail'});
    });
}


exports.cartChangeQty =(req,res,next)=>{ // 카트 qty 변경 
    const productId = req.params.productId;
    const qty = req.query.qty;
    req.user.changeQty(productId,qty) 
    .then(result=>{
        res.status(200).json({message:'succedd'});
    })
    .catch(err=>{
        res.status(500).json({message:'fail'});
    })
}



exports.orderChangeQty =(req,res,next)=>{ // 오더 qty 변경 
    const productId = req.params.productId;
    const qty = req.query.qty;
    Order.findOne({'user.userId':req.user._id})
    .then(order=>{
        return order.changeQty(productId,qty);
    }).then(result=>{
        res.status(200).json({message:'succed'});
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({message:'fail'});
    })

}

exports.cartOrderd=(req,res,next)=>{ // orderd or not check해주기 --> order 에 들어갈 cart목록 체크 
    const productId = req.params.productId;
    const orderd = req.query.orderd;
    req.user.orderCheck(productId,orderd)
    .then(result=>{
        res.status(200).json({message:'succed'});
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({message:'fail'});
    })
}

exports.getSearch=(req,res,next)=>{ // 상품 찾기 
    const searchWord = req.query.searchWord;
    console.log(searchWord);
    let pageNum=1;
    if(req.query.page){  pageNum=+req.query.page; }
    console.log(req.query.page);
    let totalItems; 
    Product.find({ $text : {$search: searchWord}}).countDocuments()
    .then(itemsNum=>{ 
        totalItems=itemsNum;
        return Product.find({ $text : {$search: searchWord}}) 
        .skip((pageNum-1)*POST_PER_PAGE) // 앞 페이지 product skip  
        .limit(POST_PER_PAGE) // 현재 페이지에 와야할 product 수 
    })
    .then(products=>{
        res.render('shop/searchingResult', {
            pageTitle: 'searching result',
            path:'/search?searchWord='+searchWord,
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


exports.postAddReview=(req,res,next)=>{ // 리뷰 추가 
    const productId = req.body.productId;
    const title = req.body.title;
    const contents = req.body.contents;
    const user_id = req.user._id;
    const addedTime = Date.now();
    const error = validationResult(req);
    console.log(error);
    if(!error.isEmpty()){
        return res.status(422).redirect('/products/'+productId); // 에러 처리 나중에 수정 필요 
    }
    Product.findById(productId) // 해당 프로덕트 찾기 
    .then(product=>{
        console.log(product); 
        return product.addReview(title,contents,addedTime,user_id); //추가 
    })
    .then(result=>{
        console.log(result);
        res.redirect('/products/'+productId);
    })
    .catch(err=>next(err));
    
}


exports.deleteReview = (req,res,next)=>{ // 리뷰 삭제함수 
    const ProductId = req.params.productId;
    Product.findById(ProductId)
    .then(product=>{
        return product.deleteReview(req.user._id); // 현재 로그인된 유저가 쓴 리뷰만 삭제할 수 있다. 
    })
    .then(result=>{
        res.status(200).json({message:'succeed'});
    })
    .catch(err=>{res.status(500).json({message:'fail'})
    console.log(err);
});
}