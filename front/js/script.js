function getProducts() {
        return new Promise (resolve => {
                fetch(`http://localhost:3000/api/products`)
                .then(res => res.json())
                .then(res => resolve(res));
        })
}

function displayProducts(){
        document.querySelector(".items");
        getProducts().then(products => {
                products.forEach(product => {
                        var a = document.createElement("a");
                        a.href = `./product.html?id=${product._id}`;
                        console.log(a);

                       
                        var img = document.createElement("img")
                        img.src = `${product.imageUrl}`;
                        console.log(img);


                        var alt = document.createElement("alt")
                        alt = `${product.altTxt}`;
                        console.log(alt);


                        var nameh3 = document.createElement("h3")
                        nameh3 = `${product.name}`;
                        console.log(nameh3);
                      

                        var description = document.createElement("p")
                        description = `${product.description}`;
                        console.log(description);

                        article.appendChild(img);
                        article.appendChild(alt);
                        article.appendChild(nameh3);
                        article.appendChild(description);
                        a.appendChild(article);
                        items.appendChild(a);
                        
                })  
                
        })
       
      
        
       
}
displayProducts();

