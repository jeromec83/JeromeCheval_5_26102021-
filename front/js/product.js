const str = window.location.href; //recupere url de la page//
const url = new URL(str);
const idProduct = url.searchParams.get("id");
console.log(idProduct);
//localStorage.clear();

function getProduct() {
  return new Promise((resolve) => {
    fetch(`http://localhost:3000/api/products/` + idProduct)
      .then((res) => res.json())
      .then((res) => resolve(res));
  }).catch((error) => {});
}

//recuperation et insertion des elements//
function displayProduct() {
  document.querySelector(".items");
  getProduct().then((product) => {
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

    product.colors.forEach((color) => {
      var colorOption = document.createElement("option");
      console.log(colorOption);
      colorOption.textContent = color;
      document.querySelector("#colors").appendChild(colorOption);
    });

    document.querySelector(".item__img").appendChild(img);
    document.querySelector("#title").appendChild(nameh1);
    document.querySelector("#price").appendChild(price);
    document.querySelector("#description").appendChild(description);
  });
}
displayProduct();

//ajout au panier//
const addToCartBtn = document.getElementById("addToCart");
addToCartBtn.addEventListener("click", () => {
  const itemColor = document.getElementById("colors").value;
  const itemQuantity = document.getElementById("quantity").value;

  // Message si la quantité et la couleur ne sont pas selectionnées//
  if (itemColor === "") {
    alert("Merci de bien vouloir choisir une couleur");
  } else if (itemQuantity == 0) {
    alert(
      "Avant de valider votre panier, merci d'indiquer la quantité souhaitée"
    );
  } else {
    // Mise dans le localStorage //
    const inCart = [idProduct, itemQuantity, itemColor];

    let updatedCart = JSON.parse(localStorage.getItem("cart"));

    if (updatedCart) {
      updatedCart.forEach((c) => {
        if (c[0] === inCart[0] && c[2] === inCart[2]) {
          c[1] = parseInt(c[1]) + parseInt(inCart[1]);
          localStorage.setItem("cart", JSON.stringify(updatedCart));
        }
      });
    } else {
      updatedCart.push(inCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.location.href = "./cart.html";
  }
});
