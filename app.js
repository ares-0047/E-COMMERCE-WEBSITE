// --- 1. DOM ELEMENTS ---
// Main UI
const productGrid = document.getElementById('product-grid');
const cartCountElement = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sort-select');
const searchInput = document.getElementById('search-input');

// Auth UI (Header)
const authBtn = document.getElementById('auth-btn');
const userGreeting = document.getElementById('user-greeting');

// Checkout UI
const checkoutModal = document.getElementById('checkout-modal');
const paymentForm = document.getElementById('payment-form');
const paymentRadios = document.querySelectorAll('input[name="payment"]');
const upiSection = document.getElementById('upi-section');
const cardSection = document.getElementById('card-section');

// Tracking UI
const trackModal = document.getElementById('track-modal');
const trackInput = document.getElementById('track-id-input');
const trackResult = document.getElementById('track-result');
const trackError = document.getElementById('track-error');


// --- 2. STATE MANAGEMENT ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// Coupon State
let activeCoupon = null; // Stores { code: "SAVE10", percent: 0.10 }

const AVAILABLE_COUPONS = {
    "SAVE10": 0.10,   // 10% off
    "ARORA20": 0.20,  // 20% off
    "WELCOME50": 0.50 // 50% off
};


// --- 3. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Render Products (from data.js)
    renderProducts(productsData);
    
    // 2. Update Cart UI
    updateCartUI();
    
    // 3. Check Login Status
    checkLoginState();

    // 4. Load Dark Mode Preference
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('#theme-toggle i');
        if(icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
});


// --- 4. PRODUCT RENDERING ---
function renderProducts(products) {
    productGrid.innerHTML = '';
    
    if (products.length === 0) {
        productGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center;">No products found.</div>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <div class="card-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="card-details">
                <span class="card-category">${product.category}</span>
                <h4 class="card-title">${product.name}</h4>
                <div class="card-price">$${product.price.toFixed(2)}</div>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
        `;
        productGrid.appendChild(card);
    });
}


// --- 5. CART FUNCTIONALITY ---
function addToCart(id) {
    const product = productsData.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`${product.name} added to cart!`, 'success');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
    showToast("Item removed from cart.", 'info');
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function toggleCart() {
    document.getElementById('cart-overlay').classList.toggle('open');
}

// --- COUPON LOGIC ---
function applyCoupon() {
    const input = document.getElementById('coupon-input');
    const msg = document.getElementById('coupon-msg');
    
    if (!input || !msg) return;

    const code = input.value.trim().toUpperCase();

    // Reset
    activeCoupon = null;
    msg.textContent = "";
    msg.className = "coupon-msg";

    if (!code) {
        msg.textContent = "Please enter a code.";
        msg.classList.add('error');
        updateCartUI();
        return;
    }

    // Validate
    if (AVAILABLE_COUPONS.hasOwnProperty(code)) {
        activeCoupon = {
            code: code,
            percent: AVAILABLE_COUPONS[code]
        };
        msg.textContent = `Coupon ${code} applied!`;
        msg.classList.add('success');
        showToast("Coupon Applied Successfully!", "success");
    } else {
        msg.textContent = "Invalid coupon code.";
        msg.classList.add('error');
        showToast("Invalid Coupon Code", "error");
    }

    updateCartUI();
}

function updateCartUI() {
    // 1. Update Badge Count
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCountElement.textContent = totalItems;

    // 2. Render Cart Items
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color:#888;">Your cart is empty.</p>';
    }

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        const itemEl = document.createElement('div');
        itemEl.classList.add('cart-item');
        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <span class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fa-solid fa-trash"></i>
            </span>
        `;
        cartItemsContainer.appendChild(itemEl);
    });

    // 3. Calculate Totals with Discount
    let discountAmount = 0;
    
    if (activeCoupon) {
        discountAmount = subtotal * activeCoupon.percent;
        const discountRow = document.getElementById('discount-row');
        if (discountRow) {
            discountRow.classList.remove('hidden');
            document.getElementById('cart-discount').textContent = `-$${discountAmount.toFixed(2)} (${activeCoupon.code})`;
        }
    } else {
        const discountRow = document.getElementById('discount-row');
        if (discountRow) discountRow.classList.add('hidden');
    }

    const finalTotal = subtotal - discountAmount;

    // 4. Update Price Elements
    const subtotalEl = document.getElementById('cart-subtotal');
    if (subtotalEl) {
        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        cartTotalElement.textContent = `$${finalTotal.toFixed(2)}`;
    } else {
        cartTotalElement.textContent = `$${finalTotal.toFixed(2)}`;
    }

    // Update Checkout Modal Total if it's currently open
    const checkoutTotalEl = document.getElementById('checkout-final-total');
    if (checkoutTotalEl) {
        checkoutTotalEl.textContent = `$${finalTotal.toFixed(2)}`;
    }
}


// --- 6. FILTER, SORT & SEARCH ---
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const category = e.target.dataset.category;
        const filtered = category === 'all' 
            ? productsData 
            : productsData.filter(p => p.category === category);
        
        renderProducts(filtered);
    });
});

sortSelect.addEventListener('change', (e) => {
    const value = e.target.value;
    let sortedProducts = [...productsData];

    if (value === 'low-high') {
        sortedProducts.sort((a, b) => a.price - b.price);
    } else if (value === 'high-low') {
        sortedProducts.sort((a, b) => b.price - a.price);
    }

    renderProducts(sortedProducts);
});

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = productsData.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.category.toLowerCase().includes(term)
    );
    renderProducts(filtered);
});


// --- 7. CHECKOUT & PAYMENTS ---
function openCheckout() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        if(confirm("You need to login to checkout. Go to login page?")) {
            window.location.href = "login.html";
        }
        return;
    }

    if (cart.length === 0) {
        showToast("Your cart is empty!", "error");
        return;
    }
    
    updateCartUI(); 
    document.getElementById('cart-overlay').classList.remove('open');
    checkoutModal.classList.add('open');
}

function closeCheckout() {
    checkoutModal.classList.remove('open');
}

paymentRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'upi') {
            upiSection.classList.remove('hidden');
            cardSection.classList.add('hidden');
            document.getElementById('upi-id').setAttribute('required', '');
        } else if (e.target.value === 'card') {
            cardSection.classList.remove('hidden');
            upiSection.classList.add('hidden');
            document.getElementById('upi-id').removeAttribute('required');
        } else {
            upiSection.classList.add('hidden');
            cardSection.classList.add('hidden');
            document.getElementById('upi-id').removeAttribute('required');
        }
    });
});

paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const selectedMethod = document.querySelector('input[name="payment"]:checked').value;
    
    if (selectedMethod === 'upi') {
        const upiId = document.getElementById('upi-id').value;
        if (!validateUPI(upiId)) {
            showToast("Invalid UPI ID format", "error");
            return;
        }
    }

    const btn = paymentForm.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = "Processing Payment...";
    btn.disabled = true;

    // Calculate Data
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discount = activeCoupon ? subtotal * activeCoupon.percent : 0;
    const finalTotal = subtotal - discount;

    setTimeout(() => {
        // Generate Order
        const orderId = 'ORD' + Math.floor(1000 + Math.random() * 9000);
        const newOrder = {
            id: orderId,
            date: new Date().toLocaleDateString(),
            timestamp: Date.now(),
            items: [...cart],
            subtotal: subtotal,
            discount: discount,
            total: finalTotal,
            method: selectedMethod,
            coupon: activeCoupon ? activeCoupon.code : null
        };

        // Save Order
        const currentOrders = JSON.parse(localStorage.getItem('orders')) || [];
        currentOrders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(currentOrders));

        // Clear State
        cart = [];
        activeCoupon = null; 
        saveCart();
        updateCartUI();

        // Success UI
        btn.innerText = "Payment Successful!";
        btn.style.backgroundColor = "#10b981"; 
        
        setTimeout(() => {
            closeCheckout();
            showToast(`Order Placed! ID: ${orderId}`, "success");
            alert(`Order Successful!\n\nID: ${orderId}\nPaid: $${finalTotal.toFixed(2)}\n\nUse the truck icon to track status.`);
            
            // Reset Button
            btn.innerText = originalText;
            btn.disabled = false;
            btn.style.backgroundColor = ""; 
        }, 1500);

    }, 2000);
});

function validateUPI(id) {
    const re = /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/;
    return re.test(id);
}


// --- 8. ORDER TRACKING SYSTEM ---
function openTrackModal() {
    trackModal.classList.add('open');
}

function closeTrackModal() {
    trackModal.classList.remove('open');
    trackResult.classList.add('hidden');
    trackError.classList.add('hidden');
    trackInput.value = '';
}

function trackOrder() {
    const inputId = trackInput.value.trim();
    const currentOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = currentOrders.find(o => o.id === inputId);

    if (!order) {
        trackResult.classList.add('hidden');
        trackError.classList.remove('hidden');
        showToast("Order ID not found", "error");
        return;
    }

    trackError.classList.add('hidden');
    trackResult.classList.remove('hidden');
    
    document.getElementById('res-id').textContent = order.id;
    document.getElementById('res-date').textContent = order.date;

    const minutesElapsed = (Date.now() - order.timestamp) / 1000 / 60;
    updateTimeline(minutesElapsed);

    const itemsList = document.getElementById('track-items-list');
    itemsList.innerHTML = '';
    
    order.items.forEach(item => {
        itemsList.innerHTML += `
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <span>${item.quantity}x ${item.name}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });

    const displayTotal = order.total ? order.total : order.items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    itemsList.innerHTML += `
        <div style="border-top:1px solid #eee; margin-top:10px; padding-top:5px; font-weight:bold;">
            <span>Total Paid</span>
            <span>$${displayTotal.toFixed(2)}</span>
        </div>
    `;
}

function updateTimeline(minutes) {
    const steps = ['step-packed', 'step-shipped', 'step-delivered'];
    steps.forEach(id => document.getElementById(id).classList.remove('active'));

    if (minutes > 0.5) document.getElementById('step-packed').classList.add('active');
    if (minutes > 0.7) document.getElementById('step-shipped').classList.add('active');
    if (minutes > 1.0) document.getElementById('step-delivered').classList.add('active');
}


// --- 9. AUTHENTICATION HANDLING ---
function checkLoginState() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const greeting = document.getElementById('user-greeting');
    
    if (!authBtn || !greeting) return;

    if (user) {
        greeting.textContent = `Hi, ${user.name.split(' ')[0]}`;
        authBtn.title = "Click to Logout";
        authBtn.querySelector('i').style.color = "var(--primary)";
    } else {
        greeting.textContent = "";
        authBtn.title = "Login / Signup";
        authBtn.querySelector('i').style.color = "";
    }
}

function handleAuthClick() {
    const user = localStorage.getItem('currentUser');

    if (user) {
        if (confirm("Are you sure you want to logout?")) {
            localStorage.removeItem('currentUser');
            window.location.reload(); 
        }
    } else {
        window.location.href = "login.html";
    }
}

// --- 10. DARK MODE TOGGLE ---
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('#theme-toggle i');
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    if (isDark) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}


// --- 11. CUSTOM TOAST NOTIFICATIONS ---
function showToast(message, type = 'success') {
    // 1. Create Container if it doesn't exist
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    // 2. Define Icons based on type
    const icons = {
        success: 'fa-circle-check',
        error: 'fa-circle-xmark',
        info: 'fa-circle-info'
    };
    const iconClass = icons[type] || icons.success;

    // 3. Create Toast Element
    const toast = document.createElement('div');
    toast.classList.add('toast', type);
    toast.innerHTML = `
        <i class="fa-solid ${iconClass}"></i>
        <span>${message}</span>
    `;

    // 4. Add to Container
    container.appendChild(toast);

    // 5. Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('toast-hiding'); // Trigger exit animation
        toast.addEventListener('transitionend', () => {
            toast.remove();
            if (container.children.length === 0) {
                container.remove(); // Clean up container if empty
            }
        });
    }, 3000);
}