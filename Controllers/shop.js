const Product = require('../Models/product');
const OrderProduct=require('../Models/orderProduct');
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
    req.user.getCart() // user-cart가져오기 --> user.createCart해서 접근가능 ==> 유저에 해당하는 cart를 가져오는 것 
    .then(cart=>{
        return cart.getProducts() // cart에 속한 Products가져오기 
    })
    .then(products=>{
        console.log(products);
        res.render('shop/cart',{
            path:'/cart',
            pageTitle:'my Cart',
            products:products
        });
    })
    .catch(err=>console.log(err));
}

exports.postAddToCart=(req,res,next)=>{
    const productId= req.body.productId;
    let newQuantity=1;
    let fetchedCart;//전역에서 cart에 접근 가능하도록 
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
            const oldQuantity = product.CartProduct.quantity;
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

exports.getOrder=(req,res,next)=>{ // Order페이지 띄우기 
    req.user.getOrders({include:['Products']}) // 여기서 Products는 table에 저장된 이름 Product에 s 추가한 것..
    .then(order=>{
        res.render('shop/orders',{
            pageTitle:'My order',
            path:'/orders',
            orders:order
        });
    })
    .catch(err=>console.log(err));
}

exports.postAddToOrder=(req,res,next)=>{ // Cart에서 Order로 추가 
    //Cart에 있는 Product모두 Order에 추가.
    //Cart에 에 있는 Product 비우기 
    let fetchedCart; // 전역에서 접근가능핟로ㅗㄱ 
    req.user.getCart() // 카트 불러내기 
    .then(cart=>{ 
        fetchedCart=cart;  
        return cart.getProducts(); // 카트 내 Products 불러내기 
    })
    .then(products=>{ 
        req.user.createOrder() // user-Order생성
        .then(order=>{ 
            order.addProducts(products.map(product=>{ // Order에 Product추가 
                product.OrderProduct = {quantity:product.CartProduct.quantity};
                return product;
            }));
        })
        .catch(err=>console.log(err));
    })
    .then(result=>{ // Order에 추가후 Cart Product null로 만들기 (비우기)
        return fetchedCart.setProducts(null);
    })
    .then(result=>{
        res.redirect('/orders');
    })
    .catch(err=>console.log(err));
}