//PAGE PANIER
const cart = JSON.parse(localStorage.getItem("cart"));
// afficher le contenu du panier 
async function displayItem() {
    if (cart === null || cart == 0) {
        // ajout d'une div "panier vide"
        document.querySelector("#cart__items").innerHTML = "<div class=\"cart_item\">Votre panier est vide !</div>";
        // masquer le formulaire de commande
        document.querySelector(".cart__order").style.display = "none";
    } else {
        for (let i = 0; i < cart.length; i++) {
            const product = cart[i];
            let idKanap = cart[i][0];
            
            // appeler l'api et récup les données de l'élément ciblé dans la boucle
            await fetch("http://localhost:3000/api/products/" + product[0])
                .then(function (res) {
                    if (res.ok) {
                        return res.json();
                    }
                })
                .then(function (value) { // affichage du panier 
                    let productPrice = value.price;
                    let productName = value.name;
                    let imageUrl = value.imageUrl;
                    let altTxt = value.altTxt;

                    // créer les éléments dans lesquels les infos des produits vont ê affichés :
                    let cartSection = document.querySelector('#cart__items');
                    let article = document.createElement('article');
                    article.className = "cart__item";
                    article.setAttribute('data-id', idKanap);

                    let divImage = document.createElement('div');
                    divImage.className = ".cart__item__img";
                    divImage.innerHTML = `<img src="${imageUrl}" alt="${altTxt}" width="150px" height="auto">`

                    let divContent = document.createElement('div');
                    divContent.className = "cart__item__content";

                    let divTitlePrice = document.createElement('div');
                    divTitlePrice.className = "cart__item__content__titlePrice";
                    let title = document.createElement('h2');
                    title.innerHTML = productName;
                    let price = document.createElement('p');
                    price.innerHTML = productPrice * product[1] + ' EUR';

                    let divSettings = document.createElement('div');
                    divSettings.className = "cart__item__content__settings";
                    let divQuantity = document.createElement('div');
                    divQuantity.className = "cart__item__content__settings__quantity";
                    // divQuantity.innerHTML = `<p>Qté :<p> <br/>
                    //     <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">`;
                    let quantityTitle = document.createElement('p');
                    quantityTitle.innerHTML = "Qté : ";
                    let quantityInput = document.createElement('input');
                    quantityInput.type = "number";
                    quantityInput.name = "itemQuantity";
                    quantityInput.className = "itemQuantity";
                    quantityInput.min = "1";
                    quantityInput.max = "100";
                    quantityInput.value = product[1];

                    let divColor = document.createElement('div');
                    divColor.innerHTML = `<p>Couleur : ${product[2]}<p>`;

                    let divDelete = document.createElement('div');
                    divDelete.className = "cart__item__content__settings__delete";
                    let deleteItem = document.createElement('p');
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
                })
                .catch(function (error) {
                    console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
                });
        }
    };
}
displayItem();

// total des quantités
let totalQuantity = 0 
if (cart != null) {
    for (let j = 0; j < cart.length; j++) {
        totalQuantity += parseInt(cart[j][1]);

        document.getElementById("totalQuantity").textContent = totalQuantity;
    }

    // Prix total

    for (let k = 0; k < cart.length; k++) { // index 0, Condition, incrémentation de l'index

        fetch(`http://localhost:3000/api/products/${cart[k][0]}`)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(value) {
            totalPrices(value);  
        })
        .catch(function(error) {
            // Une erreur est survenue
        });
        function totalPrices(value) {
            let totalPrice = 0 
            for (let j = 0; j < cart.length; j++) {
                totalPrice += parseInt(cart[j][1]) * parseInt(value.price);

                document.getElementById("totalPrice").textContent = totalPrice;
            }
        }
    }
}

 // bouton supprimer 

const btnSupprimer = document.getElementsByClassName("deleteItem");
var articlesLocalStorage = JSON.parse(localStorage.getItem("produits")); // <<< on recupère le localStorage
    
for (let j = 0; j < btnSupprimer.length; j++) {
    btnSupprimer[j].addEventListener("click" , (event) => {

        var elementSupprimer = articlesLocalStorage.splice(j, 1);
        localStorage.setItem("produits", JSON.stringify(articlesLocalStorage));
        window.location.reload(true);
    })
}






















































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
    products: cart.map((e) => e.idProduit),
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
})
