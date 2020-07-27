const Product = require('../Models/product');
const { validationResult } = require('express-validator/check');
const fileHelper = require('../util/fileHelper');

    //admin으로부터 등록된 products만 보여준다.
exports.getProducts=(req,res,next)=>{
    Product.find({userId:req.user._id})
    .then(products=>{
        res.render('admin/products',
        {
            products: products,
            pageTitle:'product list from admin',
            path:'/admin/products',
        });
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

//  현재 로그인한 유저가 Product 등록 페이지 ( Seller only )
exports.getAddProduct=(req,res,next)=>{
    res.render('admin/add-product', {
        pageTitle: 'ADD NEW PRODUCT',
        path: '/admin/add-product',
        editing:false,
        isError:false,
        ErrorMessage:'',
        validationError:[]
    });
};

//  현재 로그인한 유저가 Product 등록 리퀘스트  ( Seller only )
exports.postAddProduct=(req,res,next)=>{
    // add product에서 버튼을 누르면 작동 
    // 해당 product를 저장하는 작업 수행
    const title = req.body.title;
    const image =req.file; // 업로드 된 파일 
    const price = req.body.price;
    const description=req.body.description;
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).render('admin/add-product',{
            path:'/add-product',
            pageTitle:'add product',
            ErrorMessage : error.array()[0].msg,
            validationError: error.array(),
            editing:false,
            isError:true,
            product:{title:title,price:price,description:description}
        })
    }
    if(!image){ // MIME type 불일치
        return res.status(422).render('admin/add-product',{
            path:'/add-product',
            pageTitle:'add product',
            ErrorMessage : 'Image file must be JPG , PNG or JPEG',
            validationError: [],
            editing:false,
            isError:true,
            product:{title:title,price:price,description:description}
        })
    }
    const imageUrl = image.path; // db 저장용 path (static path )
    const product = new Product({
        title:title,
        price:price,
        description:description,
        imageUrl:imageUrl,
        userId:req.user._id
    });
    product.save()
    .then(result=>{
        res.redirect('/');
    }).catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

// 등록한 Product 수정 페이지 (Seller only)
exports.getEditProduct=(req,res,next)=>{
    const productId=req.params.productId; // 파라미터로 받아온 product id 
    Product.findById(productId)
    .then(product=>{
        if(product.userId.toString()!==req.user._id.toString()){
            return res.redirect('/admin/products');
        }
        res.render('admin/add-product', {
            pageTitle: 'EDIT PRODUCT',
            path: '/admin/products',
            editing:true,
            isError:false,
            product: product, 
            ErrorMessage:'',
            validationError:[]
        });
    }).catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });

};

// 등록한 Product 수정 리퀘스트 (Seller only)
exports.postEditProduct=(req,res,next)=>{ 
    const title = req.body.title;           
    const image =req.file;
    const price = req.body.price;
    const description=req.body.description;
    const productId=req.body.productId;
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).render('admin/add-product',{
            pageTitle: 'EDIT PRODUCT',
            path: '/admin/products',
            editing:true,
            isError:true,
            product:{title:title, price:price, description:description , _id:productId},
            ErrorMessage: error.array()[0].msg,
            validationError:error.array()
        });
    }
    Product.findOne({"_id":productId})
    .then(product=>{
        product.title=title;
        if(image){ // image를 새로 업로드 했을 경우에만 image path를 바꾼다.
            product.imageUrl = image.path;
        }
        product.description=description;
        product.price=price;
        product.save();
        res.redirect('/admin/products');
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postDeleteProduct=(req,res,next)=>{
    const id= req.params.productId;
    Product.findById(id)
    .then(product=>{
        if(!product){
            throw new Error('there is no product');
        }
        fileHelper.fileDelete(product.imageUrl); // 이미지 삭제
        return Product.deleteOne({_id:id});
    })
    .then(result=>{
        res.status(200).json({message:'Succed'});
    })
    .catch(err=>{
        res.status(500).json({message:'Fail!'});
    })
};

