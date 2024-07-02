 // Función para recuperar los datos del carrito de localStorage

function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.getElementById("cart__items");
    const totalQuantityElement = document.getElementById("totalQuantity");
    const totalPriceElement = document.getElementById("totalPrice");

    let totalQuantity = 0;
    let totalPrice = 0;

    for (let item of cart) {
        const url = `http://localhost:3000/api/products/${item.id}`;

        fetch(url)
            .then(response => response.json())
            .then(product => {
                let itemHtml = `
                    <article class="cart__item" data-id="${item.id}" data-color="${item.color}">
                        <div class="cart__item__img">
                            <img src="${product.imageUrl}" alt="${product.altTxt}">
                        </div>
                        <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${product.name}</h2>
                                <p>${item.color}</p>
                                <p>${product.price} €</p>
                            </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                    <p>Qté : </p>
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                        </div>
                    </article>
                `;

                cartItemsContainer.innerHTML += itemHtml;

                totalQuantity += item.quantity;
                totalPrice += product.price * item.quantity;

                totalQuantityElement.innerText = totalQuantity;
                totalPriceElement.innerText = totalPrice;

                // // Agregar eventos para la actualización de la cantidad y la eliminación del producto
                // article.querySelector(".itemQuantity").addEventListener("change", function(event) {
                //     updateQuantity(item.id, item.color, event.target.value);
                // });
                // article.querySelector(".deleteItem").addEventListener("click", function() {
                //     deleteItem(item.id, item.color);
                // });
            })
            .catch(error => console.error("Error: ", error));
    }
} loadCart()

// Actualizar productos del carrito

// Función para actualizar la cantidad de un producto en el carrito
function updateQuantity(id, color, newQuantity) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productIndex = cart.findIndex(item => item.id === id && item.color === color);

    if (productIndex >= 0) {
        cart[productIndex].quantity = parseInt(newQuantity);
        localStorage.setItem("cart", JSON.stringify(cart));
    }
}

// Borrar productos del carrito


// FORMULARIO DE CONTACTO

const nameRegex = /^[a-zA-Zàâäéèêëïîôöùûüç -]+$/;
const addressRegex = /^[0-9a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const firstName = document.getElementById("firstName").value;
const lastName = document.getElementById("lastName").value;
const address = document.getElementById("address").value;
const city = document.getElementById("city").value;
const email = document.getElementById("email").value;

function validateForm(){

if (!nameRegex.test(firstName)) {
    document.getElementById("firstNameErrorMsg").innerText = "Prénom invalide.";
    return false;
} else {
    document.getElementById("firstNameErrorMsg").innerText = "";
}

if (!nameRegex.test(lastName)) {
    document.getElementById("lastNameErrorMsg").innerText = "Nom invalide.";
    return false;
} else {
    document.getElementById("lastNameErrorMsg").innerText = "";
}

if (!addressRegex.test(address)) {
    document.getElementById("addressErrorMsg").innerText = "Address invalide.";
    return false;
} else {
    document.getElementById("addressErrorMsg").innerText = "";
}

if (!nameRegex.test(city)) {
    document.getElementById("cityErrorMsg").innerText = "City invalide.";
    return false;
} else {
    document.getElementById("cityErrorMsg").innerText = "";
}

if (!emailRegex.test(email)) {
    document.getElementById("emailErrorMsg").innerText = "Email invalide.";
    return false;
} else {
    document.getElementById("emailErrorMsg").innerText = "";
}

return true;
}

// Enviar la solicitud de pedido a la API
function submitOrder(){
    if (!validateForm()){
        return;
    }

    const cart = JSON.parse(localStorage.getItem(cart)) || [];

    const contact = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value,
    };

    const products = cart.map(item => item.id); 
    // ver de hacer formData en lugar de map
    // y en el fetch POST ver lo de Multiport

    const orderData = {
        contact: contact,
        product: products
    }

    fetch ("http://localhost:3000/api/products/order", {
        method: "POST",

        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },

        body: JSON.stringify({}),
    })

    .then(response => response.json())
    .then(data =>
        // redirigir a la página de confirmación
        window.location.href = `href="./confirmation.html?orderId=${data.orderId}"`
        )
}

// submit con el boton
document.getElementById("order").addEventListener("submit", submitOrder);


// PENDIENTE: HACER QUE REDIRIJA A LA PAGINA CONFIRMATION DESPUES DE HACER CLIC EN COMANDER