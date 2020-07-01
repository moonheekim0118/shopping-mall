const Product = require('../Models/product');

exports.getIndex=(req,res,next)=>{
    Product.findAll()
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
    Product.findByPk(productId)
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
    Product.findAll()
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
    Product.findAll()
    .then(product=>{
        res.render('shop/cart',{
            product:product,
            pageTitle:'my Cart',
            path:'/cart'
        });
    })
    .catch(err=>console.log(err));
}

exports.postAddToCart=(req,res,next)=>{

}

exports.getOrder=(req,res,next)=>{

}

exports.postAddToOrder=(req,res,next)=>{
    
}