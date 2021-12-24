// PAGE PRODUIT

// recup url de la page precedente
const params = window.location.href;
const kanapUrl = new URL(params);
// recup _id produit dans l'url
const idKanap = kanapUrl.searchParams.get("id");

//envoi id à l'api pour retourner infos du produit
fetch(`http://localhost:3000/api/products/${idKanap}`)
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
  })
  .then((value) => {
    //modif titre page web avec nom produit
    document.querySelector("title").innerText = value.name;
    // recup div image dans laquelle la balise image doit apparaître
    const divImage = document.querySelector(".item__img");
    const image = document.createElement("img");
    image.src = value.imageUrl;
    image.alt = value.altTxt;
    //affichage image
    divImage.appendChild(image);
    // modif titre, prix et description
    document.querySelector("#title").innerText = value.name;
    document.querySelector("#price").innerText = value.price;
    document.querySelector("#description").innerText = value.description;
    //implémentation du choix des couleurs dispo pour le produit
    const colors = document.querySelector("#colors");
    const colorsOptions = value.colors;
    colorsOptions.forEach((element) => {
      const option = document.createElement("option");
      option.innerHTML = element;
      option.value = element;
      colors.appendChild(option);
    });
  })
  .catch((error) => {
    console.log(
      `Il y a eu un problème avec l'opération fetch: ${error.message}`
    );
  });

const addToCartBtn = document.querySelector("#addToCart");
// fonction ajouter au panier
addToCartBtn.onclick = () => {
  const selectedColor = document.querySelector("#colors").value;
  const quantity = Number(document.querySelector("input").value);
  console.log(
    `couleur et quantité sélectionnées : ${selectedColor} ${quantity}`
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
    const cartStorage = localStorage.getItem("cart");
    if (cartStorage === null) {
      const cart = [];
      cart.push({
        ref: idKanap,
        color: selectedColor,
        quantity,
      });
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      // puisque cart != "" alors ajouter un article ou incrémenter la quantité de ce dernier dans le panier
      const cart = JSON.parse(cartStorage);
      const newCart = [];
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
          quantity,
        });
      }
      // remplace le panier par le nouveau panier avec produits ajoutés et/ou incrémentés
      localStorage.setItem("cart", JSON.stringify(newCart));
    }
  }
  window.location.href = "./cart.html";
};
