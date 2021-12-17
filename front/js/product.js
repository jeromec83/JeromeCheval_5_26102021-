// PAGE PRODUIT

// recup url de la page produit
const params = window.location.href;
const kanapUrl = new URL(params);
// recup _id produit dans l'url
const idKanap = kanapUrl.searchParams.get("id");

//envoi id à l'api pour retourner infos du produit
fetch("http://localhost:3000/api/products/" + idKanap)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (value) {
    //modif titre page web avec nom produit
    document.querySelector("title").innerText = value.name;

    // recup div image dans laquelle la balise image doit apparaître
    let divImage = document.querySelector(".item__img");
    let image = document.createElement("img");
    image.src = value.imageUrl;
    image.alt = value.altTxt;
    //affichage image
    divImage.appendChild(image);

    // modif titre, prix et description
    document.querySelector("#title").innerText = value.name;
    document.querySelector("#price").innerText = value.price;
    document.querySelector("#description").innerText = value.description;

    //implémentation du choix des couleurs dispo pour le produit
    let colors = document.querySelector("#colors");
    let colorsOptions = value.colors;
    colorsOptions.forEach((element) => {
      let option = document.createElement("option");
      option.innerHTML = element;
      option.value = element;
      colors.appendChild(option);
    });
  })
  .catch(function (error) {
    console.log(
      "Il y a eu un problème avec l'opération fetch: " + error.message
    );
  });

let addToCartBtn = document.querySelector("#addToCart");
// fonction ajouter au panier
addToCartBtn.onclick = () => {
  let selectedColor = document.querySelector("#colors").value;
  let quantity = Number(document.querySelector("input").value);
  console.log(
    "couleur et quantité sélectionnées : " + selectedColor + " " + quantity
  );

  if (
    selectedColor == "" ||
    quantity == null ||
    quantity < 1 ||
    quantity > 100
  ) {
    alert(
      "Veuillez sélectionner une des couleurs proposées pour ce modèle et une quantité en utilisant un nombre compris entre 1 et 100 svp."
    );
  } else {
    //alors ajouter au localStorage, ajouter aux articles déjà stockés s'il y en a.
    let cartStorage = localStorage.getItem("cart");

    if (cartStorage === null) {
      let cart = [];
      cart.push({
        ref: idKanap,
        color: selectedColor,
        quantity: quantity,
      });
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      // puisque cart != "" alors ajouter un article ou incrémenter la quantité de ce dernier dans le panier
      let cart = JSON.parse(cartStorage);

      let newCart = [];
      let validator = false;
      cart.forEach((product) => {
        // si produit existe déjà dans le panier augmenter qté
        if (product.ref == idKanap && product.color == selectedColor) {
          product.quantity += quantity;
          newCart.push({
            ref: product.ref,
            color: product.color,
            quantity: product.quantity,
          });
          validator = true; // produit existait déjà : sa qté a été incrémentée du nouvel ajout
        } else {
          // sinon créer produit dans panier
          newCart.push({
            ref: product.ref,
            color: product.color,
            quantity: product.quantity,
          });
        }
      });

      if (!validator) {
        newCart.push({
          ref: idKanap,
          color: selectedColor,
          quantity: quantity,
        });
      }
      // remplace le panier par le nouveau panier avec produits ajoutés et/ou incrémentés
      localStorage.setItem("cart", JSON.stringify(newCart));
      
    }
  }

  window.location.href = "./cart.html";
};
