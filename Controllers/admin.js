const Product = require('../Models/product');

exports.getProducts=(req,res,next)=>{
    //req.user에 등록된 product만 보여준다.
    req.user.getProducts()
    .then(products=>{
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
    req.user.createProduct({
        title:title,
        imageUrl:imageUrl,
        price:price,
        description:description
    })
    .then(result=>{
        console.log(result);
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getEditProduct=(req,res,next)=>{

};

exports.postEditProduct=(req,res,next)=>{

};

exports.postDeleteProduct=(req,res,next)=>{
    const id= req.body.prodId; // 삭제할 product의 id
    Product.destroy({where:{id:id}})
    .then(reuslt=>{
        res.redirect('/admin/products');
    })
    .catch(err=>console.log(err));
};

