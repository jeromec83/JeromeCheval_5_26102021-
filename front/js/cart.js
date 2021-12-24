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
    for (const product of cart) {
      const idKanap = product.ref;
      const selectedColor = product.color;
      const quantity = product.quantity;
      // appeler l'api et récup les données de l'élément ciblé dans la boucle
      await fetch(`http://localhost:3000/api/products/${idKanap}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((value) => {
          // affichage du panier
          const productPrice = value.price;
          const productName = value.name;
          const imageUrl = value.imageUrl;
          const altTxt = value.altTxt;

          // créer les éléments dans lesquels les infos des produits vont ê affichés :
          const cartSection = document.querySelector("#cart__items");
          const article = document.createElement("article");
          article.className = "cart__item";
          article.setAttribute("data-id", idKanap);

          const divImage = document.createElement("div");
          divImage.className = ".cart__item__img";
          divImage.innerHTML = `<img src="${imageUrl}" alt="${altTxt}" width="150px" height="auto">`;

          const divContent = document.createElement("div");
          divContent.className = "cart__item__content";

          const divTitlePrice = document.createElement("div");
          divTitlePrice.className = "cart__item__content__titlePrice";
          const title = document.createElement("h2");
          title.innerHTML = productName;

          const divSettings = document.createElement("div");
          divSettings.className = "cart__item__content__settings";
          const divQuantity = document.createElement("div");
          divQuantity.className = "cart__item__content__settings__quantity";
          const quantityTitle = document.createElement("p");
          quantityTitle.innerHTML = "Qté : ";
          const quantityInput = document.createElement("input");
          quantityInput.type = "number";
          quantityInput.name = "itemQuantity";
          quantityInput.className = "itemQuantity";
          quantityInput.min = "1";
          quantityInput.max = "100";
          quantityInput.value = quantity;

          const price = document.createElement("p");
          price.innerHTML = `${productPrice * quantityInput.value} EUR`;

          const divColor = document.createElement("div");
          divColor.innerHTML = `<p>Couleur : ${selectedColor}<p>`;

          const divDelete = document.createElement("div");
          divDelete.className = "cart__item__content__settings__delete";
          const deleteItem = document.createElement("p");
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
            price.innerHTML = `${productPrice * event.target.value} EUR`;
          });
        })
        .catch((error) => {
          console.log(
            `Il y a eu un problème avec l'opération fetch: ${error.message}`
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
  const itemQuantity = document.querySelectorAll(".itemQuantity");
  for (let k = 0; k < itemQuantity.length; k++) {
    itemQuantity[k].addEventListener("change", () => {
      //callback
      const newQty = itemQuantity[k].value;
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
  const deleteItem = document.querySelectorAll(".deleteItem");
  for (let j = 0; j < deleteItem.length; j++) {
    deleteItem[j].addEventListener("click", (event) => {
      //callback
      event.preventDefault();
      const itemToDelete = cart.indexOf(cart[j]);
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

  const elements = document.querySelectorAll(".cart__item");
  elements.forEach((element) => {
    const dataAttribute = element.getAttribute("data-id");
    const productQty = element.querySelector(".itemQuantity").value;
    //total de produit dans le panier :
    totalQty += Number(productQty);
    document.querySelector("#totalQuantity").innerText = totalQty;
    // prix total du panier
    fetch(`http://localhost:3000/api/products/${dataAttribute}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((value) => {
        const productPrice = Number(value.price);
        // calcul total
        totalPce += productQty * productPrice;
        // affichage prix total dans le panier
        document.querySelector("#totalPrice").innerText = totalPce;
      })
      .catch((error) => {
        console.log(
          "Il y a eu un problème avec l'opération fetch pour le calcul total : " +
            error.message
        );
      });
  });
}

/******************************* vérifier les infos dans le formulaire de commande + requet post api */
//récupération des données du formulaire
const form = document.querySelector(".cart__order__form");
const firstName = document.querySelector("#firstName");
const lastName = document.querySelector("#lastName");
const address = document.querySelector("#address");
const city = document.querySelector("#city");
const email = document.querySelector("#email");

// fonction pour vérifier les données du formulaire du
// prénom
const firstNameCheck = () => {
  const firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
  if (
    !/^[A-Za-zÀ-ÿ]'?[- a-zA-Z]+$/gi.test(firstName.value) ||
    firstName.value == ""
  ) {
    firstNameErrorMsg.textContent =
      "Renseignez votre prénom en lettres sans espace (un tiret pour separer) pour valider votre commande.";
    return false;
  }
  firstNameErrorMsg.textContent = "";
  return true;
};
// fonction pour vérifier les données du formulaire du nom
const lastNameCheck = () => {
  const lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
  if (
    !/^[A-Za-zÀ-ÿ\-']'?[- a-zA-Z]+$/gi.test(lastName.value) ||
    lastName.value == ""
  ) {
    lastNameErrorMsg.textContent =
      "Renseignez votre nom en lettres sans espace (un tiret pour separer) pour valider votre commande.";
    return false;
  }
  lastNameErrorMsg.textContent = "";
  return true;
};
// fonction pour vérifier les données du formulaire de l'adresse
const addressCheck = () => {
  const addressErrorMsg = document.querySelector("#addressErrorMsg");
  if (
    !/^([A-Za-zÀ-ÿ]|[0-9]{1,4})([A-Za-zÀ-ÿ\-' ]+$)/gi.test(
      address.value
    ) ||
    address.value == ""
  ) {
    addressErrorMsg.textContent =
      "Renseignez votre addresse pour valider votre commande. Ex : 25 rue du confort";
    return false;
  }
  addressErrorMsg.textContent = "";
  return true;
};
// fonction pour vérifier les données du formulaire de la ville
const cityCheck = () => {
  const cityErrorMsg = document.querySelector("#cityErrorMsg");
  if (!/^[A-Za-zÀ-ÿ\-']'?[- a-zA-Z]+$/gi.test(city.value) || city.value == "") {
    // ou cp + ville : /^[0-9]{5} [A-Za-zÀ-ÿ\-' ]+$/gi
    cityErrorMsg.textContent =
      "Renseignez votre ville en toutes lettres pour valider votre commande.";
    return false;
  }
  cityErrorMsg.textContent = "";
  return true;
};
// fonction pour vérifier les données du formulaire de l'email
const emailCheck = () => {
  const emailErrorMsg = document.querySelector("#emailErrorMsg");
  if (
    !/([a-z\.\-]{1,})@([a-z\-\.]{2,})\.([a-z]{2,4})/gi.test(email.value) ||
    email.value == ""
  ) {
    emailErrorMsg.textContent =
      'Renseignez votre email sous le format "xxxxx@xxxx.xxx" pour valider votre commande.';
    return false;
  }
  emailErrorMsg.textContent = "";
  return true;
};

// event listerner : au click si vérifs ok alors envoyer contact + products à api (post)
const orderBtn = document.querySelector("#order");
orderBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let contact = {};
  const products = [];
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
    const order = {
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
      .then((value) => {
        const orderLink = document.createElement("a");
        orderLink.href = `confirmation.html?id=${value.orderId}`;
        //redirection vers page confirmation + orderId
        window.location.href = orderLink;
      })
      .catch((err) => {
        console.error(err);
      });
  }
}); // fin eventListener
