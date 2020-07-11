const Product = require('../Models/product');

exports.getProducts=(req,res,next)=>{
    //admin으로부터 등록된 products만 보여준다.
    Product.find({userId:req.user._id})
    .then(products=>{
        console.log(products);
        res.render('admin/products',
        {
            products: products,
            pageTitle:'product list from admin',
            path:'/admin/products',
        });
    })
    .catch();
};

exports.getAddProduct=(req,res,next)=>{
    //req.user가 특정 product를 등록하는 버튼 
    res.render('admin/add-product', {
        pageTitle: 'ADD NEW PRODUCT',
        path: '/admin/add-product',
        editing:false
    });
};

exports.postAddProduct=(req,res,next)=>{
    // add product에서 버튼을 누르면 작동 
    // 해당 product를 저장하는 작업 수행
    const title = req.body.title;
    const imageUrl =req.body.imageUrl;
    const price = req.body.price;
    const description=req.body.description;
    const product = new Product({
        title:title,
        price:price,
        description:description,
        imgUrl:imageUrl,
        userId:req.user._id
    });
    product.save()
    .then(result=>{
        res.redirect('/');
    }).catch(err=>console.log(err));
};

exports.getEditProduct=(req,res,next)=>{
    const productId=req.params.productId; // 파라미터로부터 파싱해온다 
    Product.findById(productId)
    .then(product=>{
        res.render('admin/add-product', {
            pageTitle: 'EDIT PRODUCT',
            path: '/admin/add-product',
            editing:true,
            product: product //해당 product의 정보를 add-product에 보낸다. 
        });
    })
    .catch(err=>console.log(err));
};

exports.postEditProduct=(req,res,next)=>{ 
    const title = req.body.title;           
    const imageUrl =req.body.imageUrl;
    const price = req.body.price;
    const description=req.body.description;
    const productId=req.body.productId;

    Product.findById(productId)
    .then(product=>{
        product.title=title;
        product.imageUrl=imageUrl;
        product.description=description;
        product.price=price;
        product.save();
        res.redirect('/admin/products');
    })
    .catch(err=>console.log(err));
};

exports.postDeleteProduct=(req,res,next)=>{
    const id= req.body.prodId; // 삭제할 product의 id
    Product.deleteOne({_id:id})
    .then(result=>{
        res.redirect('/admin/products');
    }).catch(err=>console.log(err));
};

