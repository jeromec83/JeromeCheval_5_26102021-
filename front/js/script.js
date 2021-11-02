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
                        img.src = `${products.imageURL}`;
                        console.log(img)

                        var alt = document.createElement("alt")
                        alt = `${products.altTxt}`;
                        console.log(alt);



                        

                })
        
        })
        
        
}

displayProducts();