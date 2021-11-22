var cartProducts = JSON.parse(localStorage.getItem("cart"));

//INTEGRATION DU PANIER//
function displayCart() {
  //SI PANIER VIDE//
  if (cartProducts === null || cartProducts == 0) {
    document.getElementById("cart__items").innerHTML = "<p>Il n'y a pas encore de Kanap ici, visitez <a href='./index.html' style=' color:white; font-weight:700'>notre séléction</a>.</p>";
    // Cacher le formulaire de saisie infos utilisateur
    document.querySelector(".cart__order").style.display = "none";
  } else {
    //SI PANIER REMPLIS//
    cartProducts.forEach(cartProduct => {
      getArticleFromApi(cartProduct);
    });
  }
}
// Fonction qui récupere puis afficher les valeurs dans l'API
function getArticleFromApi(cartProduct) {
  fetch(`http://localhost:3000/api/products/${cartProduct[0]}`)
        .then(res => {
          if (res.ok) {
            return res.json();
          }
        })
        .then(product => {
          displayProduct(product, cartProduct[1]);
        })
        .catch(error => {
          // Une erreur est survenue
        });
}


function displayProduct(product, qty) {
  // Création article
  let article = document.createElement("article");
  article.classList.add("cart__item");

  cart__items.appendChild(article);

  // Création div img

  let divImg = document.createElement("div");
  divImg.classList.add("cart__item__img");

  article.appendChild(divImg);

  // Création div cart item content

  let cartItemContent = document.createElement("div");
  cartItemContent.classList.add("cart__item__content");

  article.appendChild(cartItemContent);

  // Création cart__item__content__titlePrice

  let cartItemContentTitlePrice = document.createElement("div");
  cartItemContentTitlePrice.classList.add("cart__item__content__titlePrice");

  cartItemContent.appendChild(cartItemContentTitlePrice);

  // Création div cart__item__content__settings

  let cartItemContentSettings = document.createElement("div");
  cartItemContentSettings.classList.add("cart__item__content__settings");

  cartItemContent.appendChild(cartItemContentSettings);

  // Création div class="cart__item__content__settings__quantity

  let cartItemContentSettingsQuantity = document.createElement("div");
  cartItemContentSettingsQuantity.classList.add("cart__item__content__settings__quantity");

  cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);

  // Quantité

  let quantity = document.createElement("p");
  cartItemContentSettingsQuantity.appendChild(quantity).textContent = "Qté : " + qty;

  // div supprimer

  let cartItemContentSettingsDelete = document.createElement("div");
  cartItemContentSettingsDelete.classList.add("cart__item__content__settings__delete");

  cartItemContentSettings.appendChild(cartItemContentSettingsDelete);

  // deleteItem

  let deleteItem = document.createElement("p");
  deleteItem.classList.add("deleteItem");

  cartItemContentSettingsDelete.appendChild(deleteItem).textContent = "Supprimer";

  //IMG
  let articleImg = document.createElement("img");
  articleImg.classList.add("article-Img");
  articleImg = new Image(300, 150);
  articleImg.src = divImg.appendChild(articleImg).imgContent = product.imageUrl;

  //Nom du produit
  let productName = document.createElement("h2");
  cartItemContentTitlePrice.appendChild(productName).textContent = product.name;

  //Prix produit
  let productPrice = document.createElement("p");
  cartItemContentTitlePrice.appendChild(productPrice).textContent = product.price + " €";
}

// total des quantités
let totalQuantity = 0;
if (cartProducts != null) {
  for (let j = 0; j < cartProducts.length; j++) {
    totalQuantity += parseInt(cartProducts[j][1]);

    document.getElementById("totalQuantity").textContent = totalQuantity;
  }

  // Prix total

  for (let k = 0; k < cartProducts.length; k++) {
    // index 0, Condition, incrémentation de l'index

    fetch(`http://localhost:3000/api/products/${cartProducts[k][0]}`)
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then(function (value) {
        totalPrices(value);
      })
      .catch(function (error) {
        // Une erreur est survenue
      });
    function totalPrices(value) {
      let totalPrice = 0;
      for (let j = 0; j < cartProducts.length; j++) {
        totalPrice += parseInt(cartProducts[j][1]) * parseInt(value.price);

        document.getElementById("totalPrice").textContent = totalPrice;
      }
    }
  }
}
displayCart();
























































// ------------------ Récupération des données du formulaire---------------

const btnFormulaire = document.getElementById("order");
btnFormulaire.addEventListener("click", (event) => {
  event.preventDefault();

  const contact = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    email: document.getElementById("email").value,
  };

  //var contacts = new Object;
  //contacts = {firstName, lastName, address, city, email}
  //  ----------------- Validation du formulaire--------------------
  // Le prénom
  const lePrenom = contact.firstName;
  if (/^([A-Za-zéôè]{3,20})?([-]{0,1})?([A-Za-zéôè]{3,20})$/.test(lePrenom)) {
  } else {
    alert(
      "Pour le prénom des lettres en minuscules ou majuscules compris entre 3 et 20 caractères"
    );
  }

  // Le nom
  const leNom = contact.lastName;
  if (/^([A-Za-zéôè]{3,20})?([-]{0,1})?([A-Za-zéôè]{3,20})$/.test(leNom)) {
  } else {
    alert(
      "Pour le nom des lettres en minuscules ou majuscules compris entre 3 et 20 caractères"
    );
  }

  // L'adresse
  const ladresse = contact.address;
  if (
    /^([A-Za-z0-9\s]{3,50})?([-]{0,1})?([A-Za-z0-9\s]{3,50})$/.test(ladresse)
  ) {
  } else {
    alert(
      "Pour l'adresse des lettres et chiffre compris entre 3 et 50 caractères"
    );
  }

  // La ville
  const laVille = contact.city;
  if (/^[A-Za-z\s-]{3,30}$/.test(laVille)) {
  } else {
    alert(
      "Pour la ville des lettres en minuscules ou majuscules compris entre 3 et 30 caractères"
    );
  }
  // Mettre l'objet formulaireValues dans le local storage

  localStorage.setItem("formulaire", JSON.stringify(contact));

  const envoyer = {
    contact,
    products: cartProducts.map((e) => e.idProduit),
  };

  // Envoie des données vers le serveur

  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(envoyer),
  })
    .then(function (res) {
      const contenu = res.json();
     
    })
    .catch(function (error) {
      console.log(error);
    });
});
