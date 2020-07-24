
const deleteProduct=(btn)=>{
    const prodId = btn.parentNode.querySelector('[name=prodId]').value;
    const csrf=btn.parentNode.querySelector('[name=_csrf]').value;
    const productElement = btn.closest('article');
    fetch('/admin/products/'+prodId, {
        method:'DELETE',
        headers:{
            'csrf-token':csrf
        }
    }).then(result=>{
        return result.json();
    }).then(data=>{
        console.log(data);
        productElement.parentNode.removeChild(productElement);
    }).catch(err=>console.log(err));
      
}

const cartChangeQty=(btn)=>{ // 데이터베이스에 수량 바꾸기 등록 
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const qty=btn.parentNode.querySelector('[name=qty]').value;
    fetch('/cart-qty/'+prodId+'/?qty='+qty, { // 파라미터로 prod Id넘겨주고 쿼리로 qty넘겨주기 
        method:'GET'
    })
    .then(result=>{
        return result.json();
    })
    .then(data=>{
        console.log(data);
    }).catch(err=>console.log(err));
    ;
}

const orderChangeQty=(btn)=>{ // 데이터베이스에 수량 바꾸기 등록 
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const qty=btn.parentNode.querySelector('[name=qty]').value;
    fetch('/order-qty/'+prodId+'/?qty='+qty, { // 파라미터로 prod Id넘겨주고 쿼리로 qty넘겨주기 
        method:'GET'
    })
    .then(result=>{
        return result.json();
    })
    .then(data=>{
        console.log(data);
    }).catch(err=>console.log(err));
    ;
}

const deleteFromCart=(btn)=>{
    const prodId=btn.parentNode.querySelector('[name=productId]').value;
    const csrf=btn.parentNode.querySelector('[name=_csrf]').value;
    const productElement = btn.closest('li');
    fetch('/cart/'+prodId, {
        method:'DELETE',
        headers:{
            'csrf-token':csrf
        }
    }).then(result=>{
        return result.json();
    }).then(data=>{
        console.log(data);
        productElement.parentNode.removeChild(productElement);
    }).catch(err=>console.log(err));
    
}

const deleteFromOrder=(btn)=>{
    const prodId=btn.parentNode.querySelector('[name=productId]').value;
    const csrf=btn.parentNode.querySelector('[name=_csrf]').value;
    const productElement=btn.closest('div');
    fetch('/order/'+prodId, {
        method:'DELETE',
        headers:{
            'csrf-token':csrf
        }
    }).then(result=>{
        return result.json();
    }).then(data=>{
        console.log(data);
        productElement.parentNode.removeChild(productElement);
    }).catch(err=>console.log(err));
}

const orderChecked=(btn)=>{ // orderd 체크 onlclick 에 따라서 orderd에 넣을 것인지 아닌지 체크해준다.
    const prodId=btn.parentNode.querySelector('[name=productId]').value;
    const orderd=btn.parentNode.querySelector('[name=order]').checked; // 체크 되었는가 ?
    fetch('/cart-orderd/'+prodId+'/?orderd='+orderd, {
        method:'GET',
    }).then(result=>{
        console.log(result);
        return result.json();
    }).then(data=>{
        console.log(data);
    }).catch(err=>console.log(err));
}


const deleteReview=(btn)=>{ // 리뷰 삭제 
    const prodId = btn.parentNode.querySelector('[name=productId').value;
    const csrf=btn.parentNode.querySelector('[name=_csrf]').value;
    const productElement = btn.closest('article');
    console.log( productElement.parentNode);
    fetch('/deleteReview/'+prodId, {
        method:'DELETE',
        headers:{
            'csrf-token':csrf
        }
    }).then(result=>{
        return result.json();
    }).then(data=>{
        console.log(data);
        productElement.parentNode.removeChild(productElement);
    }).catch(err=>console.log(err));
      
}
