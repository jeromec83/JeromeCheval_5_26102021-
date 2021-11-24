start();

function start(){
  orderIdClear();
};

function orderIdClear() {
    let orderIdLS = document.querySelector("#orderId");
    let orderId = localStorage.getItem("orderId");
    orderIdLS.innerHTML = orderId;
    // On vide le localStorage pour recommencer plus tard le processus d'achat
    localStorage.clear(); 
  }
  