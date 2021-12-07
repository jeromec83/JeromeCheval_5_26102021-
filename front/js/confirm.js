function orderIdRecup() {
	//récupération de l'url
	let url = new URL(window.location.href);
	let searchParams = new URLSearchParams(url.search);
	//si "OrderID" existe = retourner la valeur
	if (searchParams.has("orderid")) {
		let id = searchParams.get("orderid");
		return id;
		//Sinon message d'erreur
	} else {
		console.log("Error, no order Id found");
	}
}
//Affichage de OrderID au chargement de la page
window.addEventListener("load", () => {
	const orderId = document.getElementById("orderId");
	orderId.innerText = orderIdRecup();
});