const productList = document.getElementById('product-list');

// 1. Fetch data from our Express backend
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error("Error connecting to the server:", error);
        productList.innerHTML = "<p>Failed to load products. Make sure your backend server is running!</p>";
    }
}

// 2. Build the UI cards (UPGRADED BUTTON)
function displayProducts(products) {
    productList.innerHTML = ""; 
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p><strong>$${product.price.toFixed(2)}</strong></p>
            <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
        `;
        
        productList.appendChild(card);
    });
}

// ==========================================
// NEW: THE CART LOGIC
// ==========================================

// 3. Create the Cart (Check browser memory first, if empty, make a new array)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// 4. Update the little number in the navigation bar
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = cart.length;
    }
}

// 5. The function that runs when you click the button
function addToCart(id, name, price, image) {
    const newItem = { id, name, price, image };
    
    // Add the item to our array
    cart.push(newItem);
    
    // Save the updated array back into the browser's memory
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update the UI
    updateCartCount();
    
    alert(`${name} was added to your cart!`);
}

// Run these when the page loads
loadProducts();
updateCartCount();