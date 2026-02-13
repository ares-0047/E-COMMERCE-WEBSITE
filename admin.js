// admin.js

// --- STATE ---
let products = JSON.parse(localStorage.getItem('productsData')) || [];
const tbody = document.getElementById('admin-product-list');
const modal = document.getElementById('product-modal');
const form = document.getElementById('product-form');

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
    updateStats();
});

// --- RENDER FUNCTIONS ---
function renderTable() {
    tbody.innerHTML = '';
    
    // Reverse logic so newest added products appear at top
    [...products].reverse().forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${product.image}" alt="img"></td>
            <td>${product.name}</td>
            <td><span style="text-transform:capitalize">${product.category}</span></td>
            <td>$${product.price.toFixed(2)}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editProduct(${product.id})">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="action-btn btn-delete" onclick="deleteProduct(${product.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateStats() {
    document.getElementById('total-products').textContent = products.length;
    
    const totalValue = products.reduce((acc, p) => acc + p.price, 0);
    document.getElementById('total-value').textContent = `$${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

// --- CRUD OPERATIONS ---

// 1. DELETE
function deleteProduct(id) {
    if(confirm("Are you sure you want to delete this product?")) {
        products = products.filter(p => p.id !== id);
        saveData();
        renderTable();
        updateStats();
    }
}

// 2. SAVE (Add or Update)
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('edit-id').value;
    const name = document.getElementById('p-name').value;
    const price = parseFloat(document.getElementById('p-price').value);
    const category = document.getElementById('p-category').value;
    const image = document.getElementById('p-image').value;

    if (id) {
        // UPDATE Existing
        const index = products.findIndex(p => p.id == id);
        if (index > -1) {
            products[index] = { ...products[index], name, price, category, image };
        }
    } else {
        // CREATE New
        const newProduct = {
            id: Date.now(), // Unique ID
            name,
            price,
            category,
            image,
            rating: (Math.random() * (5 - 4) + 4).toFixed(1) // Default high rating for new items
        };
        products.push(newProduct);
    }

    saveData();
    closeProductModal();
    renderTable();
    updateStats();
});

// 3. EDIT (Pre-fill Modal)
window.editProduct = function(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('edit-id').value = product.id;
    document.getElementById('p-name').value = product.name;
    document.getElementById('p-price').value = product.price;
    document.getElementById('p-category').value = product.category;
    document.getElementById('p-image').value = product.image;

    document.getElementById('modal-title').textContent = "Edit Product";
    openProductModal();
}

// --- HELPER FUNCTIONS ---
function saveData() {
    localStorage.setItem('productsData', JSON.stringify(products));
}

function openProductModal() {
    modal.classList.add('open');
}

function closeProductModal() {
    modal.classList.remove('open');
    form.reset();
    document.getElementById('edit-id').value = ""; // Clear ID to switch back to "Add" mode
    document.getElementById('modal-title').textContent = "Add Product";
}