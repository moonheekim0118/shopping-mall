// const Product = require('../Models/product');

// exports.getProducts=(req,res,next)=>{
//     //req.user에 등록된 product만 보여준다.
//     req.user.getProducts()
//     .then(products=>{
//         console.log(products);
//         res.render('admin/products',
//         {
//             products: products,
//             pageTitle:'product list from admin',
//             path:'/admin/products',
//         });
//     })
//     .catch();
// };

// exports.getAddProduct=(req,res,next)=>{
//     //req.user가 특정 product를 등록하는 버튼 
//     res.render('admin/add-product', {
//         pageTitle: 'ADD NEW PRODUCT',
//         path: '/admin/add-product',
//         editing:false
//     });
// };

// exports.postAddProduct=(req,res,next)=>{
//     // add product에서 버튼을 누르면 작동 
//     // 해당 product를 저장하는 작업 수행
//     const title = req.body.title;
//     const imageUrl =req.body.imageUrl;
//     const price = req.body.price;
//     const description=req.body.description;
//     req.user.createProduct({ // 유저쪽에서 Product만들기 --> req.user.getProducts로 접근가능  
//         title:title,
//         imageUrl:imageUrl,
//         price:price,
//         description:description
//     })
//     .then(result=>{
//         console.log(result);
//         res.redirect('/admin/products');
//     })
//     .catch(err => console.log(err));
// };

// exports.getEditProduct=(req,res,next)=>{
//     const productId=req.params.productId; // 파라미터로부터 파싱해온다 
//     Product.findByPk(productId) // 파싱한 id로 product를 찾는다. 
//     .then(product=>{
//         res.render('admin/add-product', {
//             pageTitle: 'EDIT PRODUCT',
//             path: '/admin/add-product',
//             editing:true,
//             product: product //해당 product의 정보를 add-product에 보낸다. 
//         });
//     })
//     .catch(err=>console.log(err));
// };

// exports.postEditProduct=(req,res,next)=>{ 
//     const title = req.body.title;           
//     const imageUrl =req.body.imageUrl;
//     const price = req.body.price;
//     const description=req.body.description;
//     const productId=req.body.productId;
//     let changeValue={ // 바뀔요소들
//         title:title,
//         imageUrl:imageUrl,
//         price:price,
//         description:description
//     };
//     /*Product.findByPk(productId) //id로 해당 product를 찾는다. 
//     .then(product=>{
//         product.update(changeValue) // update해준다.
//         .then(result=>{
//             res.redirect('/admin/products');
//         })
//         .catch(err=>console.log(err));
//     })
//     .catch(err=>console.log(err));*/
//     Product.findByPk(productId)
//     .then(product=>{
//         product.title=title;
//         product.imageUrl=imageUrl;
//         product.description=description;
//         product.price=price;
//         product.save();
//         res.redirect('/admin/products');
//     })
//     .catch(err=>console.log(err));
// };

// exports.postDeleteProduct=(req,res,next)=>{
//     const id= req.body.prodId; // 삭제할 product의 id
//     Product.destroy({where:{id:id}})
//     .then(reuslt=>{
//         res.redirect('/admin/products');
//     })
//     .catch(err=>console.log(err));
// };

