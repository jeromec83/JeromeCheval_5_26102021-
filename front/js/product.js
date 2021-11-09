const str = window.location.href; /*recupere url de la page*/
const url = new URL(str); 
const idProduct = url.searchParams.get("id");
console.log(idProduct);

function getProducts() {
    return new Promise (resolve => {
            fetch(`http://localhost:3000/api/products/`+idProduct)
            .then(res => res.json())
            .then(res => resolve(res));
    })
    
      .catch((error) => {});
}


function displayProducts(){
    document.querySelector(".items");
    getProducts().then(products => {
            products.forEach(product => {
                    var img = document.createElement("img");
                    img.src = `${product.imageUrl}`;
                    img.alt = `${product.altTxt}`;
                    console.log(img);


                    var nameh1 = document.createElement("h1");
                    nameh1.textContent = product.name;
                    console.log(nameh1);

                    var price = document.createElement("p");
                    price.textContent = product.price;
                    console.log(price);
                  

                    var description = document.createElement("p");
                    description.textContent = product.description;
                    console.log(description);

                    document.createElement("item__img").appendChild(img);
                    document.createElement("#title").appendChild(nameh1);
                    document.createElement("#price").appendChild(price);
                    document.createElement("#description").appendChild(description);
                    
                    
            })  
            
    })
}
displayProducts();