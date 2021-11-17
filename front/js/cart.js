/*function getProduct(idProduct) {
	return new Promise((resolve) => {
	  fetch(`http://localhost:3000/api/products/` + idProduct)
		.then((res) => res.json())
		.then((res) => resolve(res));
	}).catch((error) => {});
  }*/
var cartProducts = JSON.parse(localStorage.getItem("cart"));
console.table(cartProducts);
//INTEGRATION DU PANIER//
function displayCart() {
	//SI PANIER VIDE//
  if (cartProducts === null || cartProducts == 0) {
    document.getElementById("cart__items").innerHTML =
      "<p>Il n'y a pas encore de Kanap ici, visitez <a href='./index.html' style=' color:white; font-weight:700'>notre séléction</a>.</p>";
    // Cacher le formulaire de saisie infos utilisateur
    document.querySelector(".cart__order").style.display = "none";
  } else {
	//SI PANIER REMPLIS//
	
	}
}
displayCart();
