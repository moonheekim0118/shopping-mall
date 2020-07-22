let minusPrice=0;

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
    const price=btn.parentNode.querySelector('[name=price]').value;
    minusPrice=price;
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

const adjustPrice=(price)=>{
    return price;
}