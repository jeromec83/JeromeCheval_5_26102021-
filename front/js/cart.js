//PAGE PANIER
const cartProducts = JSON.parse(localStorage.getItem("cart"));

// afficher le contenu du panier 
async function displayItem() {
    if (cartProducts === null || cartProducts == 0) {
        // ajout d'une div "panier vide"
        document.querySelector("#cart__items").innerHTML = "<div class=\"cart_item\">Votre panier est vide !</div>";
        // masquer le formulaire de commande
        document.querySelector(".cart__order").style.display = "none";
    } else {
        for (let i = 0; i < cartProducts.length; i++) {
            const product = cartProducts[i];
            let idKanap = cartProducts[i][0];
            

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

                    // créer les éléments dans lesquels les infos des produits vont être affichés :
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
                    

                    let divSettings = document.createElement('div');
                    divSettings.className = "cart__item__content__settings";
                    let divQuantity = document.createElement('div');
                    divQuantity.className = "cart__item__content__settings__quantity";
                   
                    let quantityTitle = document.createElement('p');
                    quantityTitle.innerHTML = "Qté : ";
                    let quantityInput = document.createElement('input');
                    quantityInput.type = "number";
                    quantityInput.name = "itemQuantity";
                    quantityInput.className = "itemQuantity";
                    quantityInput.min = "1";
                    quantityInput.max = "100";
                    quantityInput.value = product[1];

                    let price = document.createElement('p');
                    price.innerHTML = productPrice * quantityInput.value + ' EUR';
                    //console.log(quantityInput.value);
                     

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


                    

                    // Modification du prix du produit de produit
                    quantityInput.addEventListener("change" , (event) => {
                        price.innerHTML = productPrice * event.target.value + ' EUR';
                       
                        });
                   
                })
                
                .catch(function (error) {
                    console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
                });
        }
        deleteProduct();
        changePdtQty();
        totalPce();
    };
}
displayItem();

/* Modifier la quantité de l'article 
 * = 1 récup les input itemQuantity des articles et leur id dans le panier / 2 récup qté dans l'input itemQuantity
 * si itemQuantity change (addEventlistener) / alors set nouvelle quantité de itemQuantity ds DOM et dans cart
 */
function changePdtQty() { 
  let itemQuantity = document.querySelectorAll('.itemQuantity');
  for (let k = 0; k < itemQuantity.length; k++) {
      itemQuantity[k].addEventListener('change', () => {        
          let newQty = itemQuantity[k].value;
          if (newQty >= 1 && newQty <= 100){
              cartProducts[k][1] = itemQuantity[k].value;
              localStorage.setItem('cart', JSON.stringify(cartProducts));
              // recalcul qté et prix totaux
              totalPce();
          } else {
              alert('Veuillez saisir une valeur entre 1 et 100 s\'il vous plait.') 
              itemQuantity[k].value = product[k][1];               
          }
      })
  }
}

function totalPce() {
  let totalPce = parseInt(0);
  let totalQty = Number(0);


  let elements = document.querySelectorAll('.cart__item');
  elements.forEach(element => {
      let dataAttribute = element.getAttribute('data-id');
      let productQty = element.querySelector(".itemQuantity").value;
      //total de produit dans le panier :
      totalQty += Number(productQty);
      document.querySelector('#totalQuantity').innerText = totalQty;
      // prix total du panier
      fetch("http://localhost:3000/api/products/" + dataAttribute)
          .then(function (res) {
              if (res.ok) {
                  return res.json();
              }
          })
          .then(function (value) {
              let productPrice = Number(value.price);
              // console.log("qté du produit " + productQty + " prix produit " + productPrice)
              // calcul total
              totalPce += (productQty * productPrice);
              // affichage prix total dans le panier
              document.querySelector('#totalPrice').innerText = totalPce;
          })
          .catch(function (error) {
              console.log('Il y a eu un problème avec l\'opération fetch pour le calcul total : ' + error.message);
          });
  });
}
/* Supprimer l'article :*/

function deleteProduct() {
  let deleteItem = document.querySelectorAll('.deleteItem');
  for (let j = 0; j < deleteItem.length; j++) {
      deleteItem[j].addEventListener('click', (event) => { 
          event.preventDefault();
          let itemToDelete = cartProducts.indexOf(cartProducts[j]);
          console.log("index du produit à suppr : " + itemToDelete + " couleur : " + cartProducts[j][3])
          cartProducts.splice(itemToDelete, 1);
          // renvoyer ce nouveau panier dans le localStorage
          localStorage.setItem('cart', JSON.stringify(cartProducts));
        
          // recharger la page pour suppr affichage du produit dans le panier
          location.reload();
      })
      //recalculer le prix total sans cet article
      totalPce();
  }
}


//-------------------Formulaire regExp------------------------
// on selection le formulaire dans le HTML
let form = document.querySelector('.cart__order__form');

//-------- Validation Prenom------------------
form.firstName.addEventListener('change', function(){
  validfirstName(this);
});
const validfirstName = function(inputfirstName){
 
  //regExp = lettre minuscule et majuscule de a à z, entre 3 et 20 caractères
  let firstNameRegExp = new RegExp ("^[A-Za-z ,']{3,20}$", 'g');
  let errorMsg = document.querySelector('#firstNameErrorMsg');

  // Si les conditions sont remplie, renvoyer "true"
  if(firstNameRegExp.test(inputfirstName.value)){
    errorMsg.innerHTML= ""
    return true;
  }
  //Sinon affichage du message d'erreur 
  else{
    errorMsg.innerHTML= "Prénom non valide"
  }

};

//-------- Validation Nom------------------
form.lastName.addEventListener('change', function(){
  validlastName(this);
});
const validlastName = function(inputlastName){
 
  let lastNameRegExp = new RegExp ("^[A-Za-zéàèôö,']{3,20}$", 'g');
  let errorMsg = document.querySelector('#lastNameErrorMsg');

  if(lastNameRegExp.test(inputlastName.value)){
    errorMsg.innerHTML= ""
    return true;
  }
  else{
    errorMsg.innerHTML= "Nom non valide"
  }

};

//-------- Validation Adresse------------------
form.address.addEventListener('change', function(){
  validAddress(this);
});
const validAddress = function(inputAddress){
 
  let addressRegExp = new RegExp ("[A-Za-z0-9'\.\-\s\,]", 'g');
  let errorMsg = document.querySelector('#addressErrorMsg');

  if(addressRegExp.test(inputAddress.value)){
    errorMsg.innerHTML= ""
    return true;
  }
  else{
    errorMsg.innerHTML= "Address non valide"
  }

};

//-------- Validation Ville------------------
form.city.addEventListener('change', function(){
  validCity(this);
});
const validCity = function(inputCity){
 
  let cityRegExp = new RegExp ("^[A-Za-z ,.'-]{3,20}$", 'g');
  let errorMsg = document.querySelector('#cityErrorMsg');

  if(cityRegExp.test(inputCity.value)){
    errorMsg.innerHTML= ""
    return true;
  }
  else{
    errorMsg.innerHTML= "Ville non valide"
  }

};


//-------- Validation e-mail------------------
form.email.addEventListener('change', function(){
  validEmail(this);
});
const validEmail = function(inputEmail){
  //creation de la regExp pour la validation de l'email
  let emailRegExp = new RegExp ('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g');
  let errorMsg = document.querySelector('#emailErrorMsg');

  if(emailRegExp.test(inputEmail.value)){
    errorMsg.innerHTML= ""
    return true;
  }
  else{
    errorMsg.innerHTML= "Email non valide"
  }

};




//---------------------Soumission du formulaire---------------------
form.addEventListener('submit', function(e){
  e.preventDefault();
  // si tout les éléments sont true, le bouton commande renvoit vers la page confirmation 
  if(validfirstName(form.firstName) && 
     validlastName(form.lastName) && 
     validAddress(form.address) && 
     validCity(form.city) && 
     validEmail(form.email)){
    recupInfoForm(this);
  }
});

function recupInfoForm(form) {
  
  //Stockage des informations du formulaire
  const body = {
    'contact': {
      'firstName': form.firstName.value,
      'lastName' : form.lastName.value,
      'address'  : form.address.value,
      'city'     : form.city.value,
      'email'    : form.email.value,
    },
    //Stockage des produits du panier
    'products': Object.keys(cartProducts)
  }


  //Récuperer l'orderID dans le back-end
  fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then( res => res.json() ).then(
    js => {
      location.href =  `./confirmation.html?orderid=${js['orderId']}`
    })
  
}