
function getProducts() {
        return new Promise ((resolve, reject) => {
                fetch(`http://localhost:3000/api/products`)
                .then(res => res.json())
                .then(res => resolve(res))
                .catch(error => reject(error))
        })
}

function displayProducts(){
        document.querySelector(".items");
        getProducts().then(products => {
                products.forEach(product => {
                        /*recuperation balise a.href*/
                        var a = document.createElement("a");
                        a.href = `./product.html?id=${product._id}`;
                        console.log(a);

                        var article = document.createElement("article")

                        /*recuperation image+alt*/
                        var img = document.createElement("img")
                        img.src = `${product.imageUrl}`;
                        img.alt = `${product.altTxt}`;
                        console.log(img);

                        /*recuperation titre produite*/
                        var nameh3 = document.createElement("h3")
                        nameh3.textContent = product.name;
                        console.log(nameh3);
                      
                        /*recuperation description produit*/
                        var description = document.createElement("p")
                        description.textContent = product.description;
                        console.log(description);

                        /*affichage des infos recuperées*/
                        article.appendChild(img);
                        article.appendChild(nameh3)
                        article.appendChild(description)
                        a.appendChild(article);
                        items.appendChild(a);
                        
                })  
                
        })
       /*si erreur*/
        .catch((error) => {
        console.log(error.message);
        document.querySelector(".items").innerHTML ="Vous n'arrivez pas à accéder aux produits ? <br> Activez le serveur local (port 3000) <br> Sinon contactez nous !  ";
        document.querySelector(".items").style.textAlign = "center";
})

}

displayProducts();

