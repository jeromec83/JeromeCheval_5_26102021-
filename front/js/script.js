
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

                        var article = document.createElement("article")
                        
                        var img = document.createElement("img")
                        img.src = `${product.imageUrl}`;
                        img.alt = `${product.altTxt}`;
                        console.log(img);


                        var nameh3 = document.createElement("h3")
                        nameh3.textContent = product.name;
                        console.log(nameh3);
                      

                        var description = document.createElement("p")
                        description.textContent = product.description;
                     
                        console.log(description);

                        article.appendChild(img);
                        article.appendChild(nameh3)
                        article.appendChild(description)
                        a.appendChild(article);
                        items.appendChild(a);
                        
                })  
                
        })
       
        .catch((error) => {
      let items = document.querySelector(".items");
      items.innerHTML =
        "Vous n'arrivez pas à accéder aux produits ? <br> Activez le serveur local (port 3000) <br> Sinon contactez nous !  ";
      items.style.textAlign = "center";
    })
       
}

displayProducts();

