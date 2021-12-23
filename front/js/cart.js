//PAGE PANIER
const cart = JSON.parse(localStorage.getItem("cart"));
// fonction pour afficher le contenu du panier
async function displayItem() {
  if (cart === null || cart == 0) {
    // ajout d'une div "panier vide"
    document.querySelector("#cart__items").innerHTML =
      '<div class="cart_item">Votre panier est vide !</div>';
    // masquer le formulaire de commande
    document.querySelector(".cart__order").style.display = "none";
  } else {
    for (let i = 0; i < cart.length; i++) {
      const product = cart[i];
      let idKanap = product.ref;
      let selectedColor = product.color;
      let quantity = product.quantity;
      // appeler l'api et récup les données de l'élément ciblé dans la boucle
      await fetch("http://localhost:3000/api/products/" + idKanap)
        .then(function (res) {
          if (res.ok) {
            return res.json();
          }
        })
        .then(function (value) {
          // affichage du panier
          let productPrice = value.price;
          let productName = value.name;
          let imageUrl = value.imageUrl;
          let altTxt = value.altTxt;

          // créer les éléments dans lesquels les infos des produits vont ê affichés :
          let cartSection = document.querySelector("#cart__items");
          let article = document.createElement("article");
          article.className = "cart__item";
          article.setAttribute("data-id", idKanap);

          let divImage = document.createElement("div");
          divImage.className = ".cart__item__img";
          divImage.innerHTML = `<img src="${imageUrl}" alt="${altTxt}" width="150px" height="auto">`;

          let divContent = document.createElement("div");
          divContent.className = "cart__item__content";

          let divTitlePrice = document.createElement("div");
          divTitlePrice.className = "cart__item__content__titlePrice";
          let title = document.createElement("h2");
          title.innerHTML = productName;

          let divSettings = document.createElement("div");
          divSettings.className = "cart__item__content__settings";
          let divQuantity = document.createElement("div");
          divQuantity.className = "cart__item__content__settings__quantity";
          let quantityTitle = document.createElement("p");
          quantityTitle.innerHTML = "Qté : ";
          let quantityInput = document.createElement("input");
          quantityInput.type = "number";
          quantityInput.name = "itemQuantity";
          quantityInput.className = "itemQuantity";
          quantityInput.min = "1";
          quantityInput.max = "100";
          quantityInput.value = quantity;

          let price = document.createElement("p");
          price.innerHTML = productPrice * quantityInput.value + " EUR";

          let divColor = document.createElement("div");
          divColor.innerHTML = `<p>Couleur : ${selectedColor}<p>`;

          let divDelete = document.createElement("div");
          divDelete.className = "cart__item__content__settings__delete";
          let deleteItem = document.createElement("p");
          deleteItem.className = "deleteItem";
          deleteItem.innerText = "Supprimer";

          // affichage des éléments (ordre décroissant du plus précis au plus global)
          divTitlePrice.appendChild(title);
          divTitlePrice.appendChild(price);
          divContent.appendChild(divTitlePrice);

          divQuantity.appendChild(quantityTitle);
          divQuantity.appendChild(quantityInput);
          divSettings.appendChild(divColor);
          divSettings.appendChild(divQuantity);
          divDelete.appendChild(deleteItem);
          divSettings.appendChild(divDelete);
          divContent.appendChild(divSettings);

          article.appendChild(divImage);
          article.appendChild(divContent);
          cartSection.appendChild(article);

          // Modification du prix du produit de produit
          quantityInput.addEventListener("change", (event) => {
            price.innerHTML = productPrice * event.target.value + " EUR";
          });
        })
        .catch(function (error) {
          console.log(
            "Il y a eu un problème avec l'opération fetch: " + error.message
          );
        });
    }
    deleteProduct();
    changePdtQty();
    totalPce();
  }
}
displayItem();

/* Modifier la quantité de l'article
 * = 1 récup les input itemQuantity des articles et leur id dans le panier / 2 récup qté dans l'input itemQuantity
 * si itemQuantity change (addEventlistener) / alors set nouvelle quantité de itemQuantity ds DOM et dans cart
 */
function changePdtQty() {
  // sélection des inputs
  let itemQuantity = document.querySelectorAll(".itemQuantity");
  for (let k = 0; k < itemQuantity.length; k++) {
    itemQuantity[k].addEventListener("change", () => {
      //callback
      let newQty = itemQuantity[k].value;
      if (newQty >= 1 && newQty <= 100) {
        cart[k].quantity = itemQuantity[k].value;
        localStorage.setItem("cart", JSON.stringify(cart));
        // recalcul qté et prix totaux
        totalPce();
      } else {
        alert("Veuillez saisir une valeur entre 1 et 100 s'il vous plait.");
        itemQuantity[k].value = cart[k].quantity;
      }
    });
  }
}

/* Supprimer l'article :
 * = 1 récup articles et leur id dans le cart
 * si deleteItem click (addeventlistener) / alors set suppr product ds DOM et dans cart
 */
function deleteProduct() {
  let deleteItem = document.querySelectorAll(".deleteItem");
  for (let j = 0; j < deleteItem.length; j++) {
    deleteItem[j].addEventListener("click", (event) => {
      //callback
      event.preventDefault();
      let itemToDelete = cart.indexOf(cart[j]);
      console.log(
        "index du produit à suppr : " +
          itemToDelete +
          " couleur : " +
          cart[j].color
      );
      cart.splice(itemToDelete, 1);
      // renvoyer ce nouveau panier dans le localStorage
      localStorage.setItem("cart", JSON.stringify(cart));
      // recharger la page pour suppr affichage du produit dans le panier
      location.reload();
    });
    //recalculer le prix total sans cet article
    totalPce();
  }
}

/* fonction pour calculer le montant et la qté total du panier
 * 1 = calculer le prix d'un article * sa quantité
 * 1bis = calculer le nombre d'article total dans le panier
 * 2 = additionner les totaux de chaque ligne dans le prix total
 */
function totalPce() {
  let totalPce = parseInt(0);
  let totalQty = Number(0);

  let elements = document.querySelectorAll(".cart__item");
  elements.forEach((element) => {
    let dataAttribute = element.getAttribute("data-id");
    let productQty = element.querySelector(".itemQuantity").value;
    //total de produit dans le panier :
    totalQty += Number(productQty);
    document.querySelector("#totalQuantity").innerText = totalQty;
    // prix total du panier
    fetch("http://localhost:3000/api/products/" + dataAttribute)
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then(function (value) {
        let productPrice = Number(value.price);
        // calcul total
        totalPce += productQty * productPrice;
        // affichage prix total dans le panier
        document.querySelector("#totalPrice").innerText = totalPce;
      })
      .catch(function (error) {
        console.log(
          "Il y a eu un problème avec l'opération fetch pour le calcul total : " +
            error.message
        );
      });
  });
}

/******************************* vérifier les infos dans le formulaire de commande + requet post api */
//récupération des données du formulaire
let form = document.querySelector(".cart__order__form");
let firstName = document.querySelector("#firstName");
let lastName = document.querySelector("#lastName");
let address = document.querySelector("#address");
let city = document.querySelector("#city");
let email = document.querySelector("#email");

// fonction pour vérifier les données du formulaire du
// prénom
const firstNameCheck = () => {
  let firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
  if (!/^[A-Za-zÀ-ÿ\-']+$/gi.test(firstName.value) || firstName.value == "") {
    firstNameErrorMsg.textContent =
      "Renseignez votre prénom en lettres sans espace (un tiret pour separer) pour valider votre commande.";
    return false;
  } else {
    firstNameErrorMsg.textContent = "";
    return true;
  }
};
// fonction pour vérifier les données du formulaire du nom
const lastNameCheck = () => {
  let lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
  if (!/^[A-Za-zÀ-ÿ\-']+$/gi.test(lastName.value) || lastName.value == "") {
    lastNameErrorMsg.textContent =
      "Renseignez votre nom en lettres sans espace (un tiret pour separer) pour valider votre commande.";
    return false;
  } else {
    lastNameErrorMsg.textContent = "";
    return true;
  }
};
// fonction pour vérifier les données du formulaire de l'adresse
const addressCheck = () => {
  let addressErrorMsg = document.querySelector("#addressErrorMsg");
  if (
    !/^([A-Za-zÀ-ÿ]|[0-9]{1,4})([A-Za-zÀ-ÿ\-' ]+$)/gi.test(address.value) ||
    address.value == ""
  ) {
    addressErrorMsg.textContent =
      "Renseignez votre addresse pour valider votre commande. Ex : 25 rue du confort";
    return false;
  } else {
    addressErrorMsg.textContent = "";
    return true;
  }
};
// fonction pour vérifier les données du formulaire de la ville
const cityCheck = () => {
  let cityErrorMsg = document.querySelector("#cityErrorMsg");
  if (!/^[A-Za-zÀ-ÿ\-' ]+$/gi.test(city.value) || city.value == "") {
    // ou cp + ville : /^[0-9]{5} [A-Za-zÀ-ÿ\-' ]+$/gi
    cityErrorMsg.textContent =
      "Renseignez votre ville en toutes lettres pour valider votre commande.";
    return false;
  } else {
    cityErrorMsg.textContent = "";
    return true;
  }
};
// fonction pour vérifier les données du formulaire de l'email
const emailCheck = () => {
  let emailErrorMsg = document.querySelector("#emailErrorMsg");
  if (
    !/([a-z\.\-]{1,})@([a-z\-\.]{2,})\.([a-z]{2,4})/gi.test(email.value) ||
    email.value == ""
  ) {
    emailErrorMsg.textContent =
      'Renseignez votre email sous le format "xxxxx@xxxx.xxx" pour valider votre commande.';
    return false;
  } else {
    emailErrorMsg.textContent = "";
    return true;
  }
};

// event listerner : au click si vérifs ok alors envoyer contact + products à api (post)
let orderBtn = document.querySelector("#order");
orderBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let contact = {};
  let products = [];
  //collecter les id des produits du panier
  cart.forEach((element) => {
    products.push(element.ref);
  });
  // vérification des inputs du formulaire
  if (
    !firstNameCheck() ||
    !lastNameCheck() ||
    !addressCheck() ||
    !cityCheck() ||
    !emailCheck()
  ) {
    e.preventDefault();
  } else {
    // récup valeurs pour objet contact
    contact = {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value,
    };
    // déclaration d'une variable contenant les infos de la commande
    let order = {
      contact,
      products,
    };

    //requete post api
    fetch("http://localhost:3000/api/products/order", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(function (value) {
        let orderLink = document.createElement("a");
        orderLink.href = "confirmation.html?id=" + value.orderId;
        //redirection vers page confirmation + orderId
        window.location.href = orderLink;
      })
      .catch((err) => {
        console.error(err);
      });
  }
}); // fin eventListener
