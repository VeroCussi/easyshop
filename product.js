// URL con parametros editados para poder acceder al ID

let params = new URLSearchParams(window.location.search);
let productId = params.get("id");

// Función para obtener los detalles del producto desde la API
function fetchProductDetails(productId) {
    const url = `http://localhost:3000/api/products/${productId}`;
    fetch(url)
        .then(response => response.json())
        .then(product => {
            // Llama a la función para mostrar los detalles del producto
            displayProductDetails(product);
        })
        .catch(error => console.error("Error: ", error));
}

// Función para mostrar los detalles del producto en la página
function displayProductDetails(product) {
    // Asignamos los detalles del producto a los elementos correspondientes en el DOM
    document.getElementById("title").innerText = product.name;
    document.getElementById("price").innerText = product.price;
    document.getElementById("description").innerText = product.description;
    document.querySelector(".item__img").innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;

    const colorsSelect = document.getElementById("colors");
    product.colors.forEach(color => {
        let option = document.createElement("option");
        option.value = color;
        option.innerText = color;
        colorsSelect.appendChild(option);
    });

    // Establecer la cantidad inicial en 1
    const quantityInput = document.getElementById("quantity");
    quantityInput.value = 1;

    // Actualizar el precio total basado en la cantidad inicial
    updateTotalPrice(product.price);

    // Agregar un evento para actualizar el precio cuando la cantidad cambia
    document.getElementById("quantity").addEventListener("input", function(event) {
        updateTotalPrice(product.price);
    });

// Función para actualizar el precio total
function updateTotalPrice(price) {
    const quantity = parseInt(document.getElementById('quantity').value);
    const totalPriceElement = document.getElementById('price');
    totalPriceElement.innerText = (price * quantity).toFixed(2);
}

}

// Llama a la función para obtener y mostrar los detalles del producto
if (productId) {
    fetchProductDetails(productId);
} else {
    console.error("Product ID not found in the URL");
}

// funcion para guardar el producto en el carrito una vez se hace clic en el boton.

document.getElementById("addToCart").addEventListener("click", function() {
    const color = document.getElementById("colors").value;
    const quantity = parseInt(document.getElementById("quantity").value);
    
    if (!color || quantity <= 0) {
        alert("Veuillez sélectionner une couleur et une quantité valide.");
        return;
    }

    const productData = {
        id: productId,
        color: color,
        quantity: quantity
    };

    // Obtiene los datos actuales del carrito desde localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Verifica si el producto ya está en el carrito
    const existingProductIndex = cart.findIndex(item => item.id === productId && item.color === color);
    
    if (existingProductIndex >= 0) {
        // Si el producto ya está en el carrito, actualizamos la cantidad
        cart[existingProductIndex].quantity += quantity;
    } else {
        // Si el producto no está en el carrito, lo agregamos
        cart.push(productData);
    }

    // Guardar los datos actualizados del carrito en localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Produit ajouté au panier");
});
