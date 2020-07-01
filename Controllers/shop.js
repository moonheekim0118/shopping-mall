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
    req.user.getCart() // user-cart가져오기 
    .then(cart=>{
        return cart.getProducts() // cart - Products가져오기 
    })
    .then(products=>{
        res.render('shop/cart',{
            path:'/cart',
            pageTitle:'my Cart',
            product:products
        });
    })
    .catch(err=>console.log(err));
}

exports.postAddToCart=(req,res,next)=>{
    const productId= req.body.productId;
    let newQuantity=1;
    let fetchedCart;
    //cartProduct에 추가해줘야함
    req.user.getCart()
    .then(cart=>{
        fetchedCart=cart;
        return cart.getProducts({where:{id:productId}});
    })
    .then(products=>{
        let product;
        if(products.length>0) product=products[0];
        if(product){
            const oldQuantity = product.cartProduct.quantity;
            newQuantity=oldQuantity+1;
        }
        return Product.findByPk(productId);
    })
    .then(product=>{
        return fetchedCart.addProduct(product,{through:{quantity:newQuantity}});
    })
    .then(()=>{
        res.redirect('/cart');
    })
    .catch(err=>console.log(err));
}

exports.getOrder=(req,res,next)=>{

}

exports.postAddToOrder=(req,res,next)=>{
    
}