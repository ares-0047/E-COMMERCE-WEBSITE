// data.js - MODIFIED FOR CMS

// --- CONFIGURATION ---
const PRODUCT_COUNT = 100; 

// Base Images (Same as before)
const categoryImages = {
    fashion: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=60", 
        "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=500&q=60", 
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=500&q=60", 
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=500&q=60", 
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=698&auto=format&fit=crop", 
        "https://unsplash.com/photos/portrait-of-beautiful-indian-girl-young-hindu-woman-in-traditional-indian-costume-lehenga-choli-or-sari-or-saree-x3Tbw8Su8Hk",
        "https://unsplash.com/photos/a-woman-in-a-red-and-gold-bridal-outfit-2DZmm6QKFQE",
        "https://unsplash.com/photos/a-man-standing-in-front-of-a-brick-wall-46OUJBIucYw",
        "https://unsplash.com/photos/a-close-up-of-a-person-wearing-a-red-dress-j3ywv4cFH4A",
        "https://plus.unsplash.com/premium_photo-1673356301535-21a4d80501a5?q=80&w=1887&auto=format&fit=crop"    
    ]    
};

const adjectives = ["Premium", "Ultra", "Minimalist", "Modern", "Classic", "Durable", "Lightweight", "Pro", "Sleek", "Essential"];
const materials = ["Cotton", "Leather",  "Ceramic", "Denim", "Carbon Fiber", "Mesh"];
const categories = [
    { id: "fashion", nouns: ["T-Shirt", "Jacket", "Sneakers", "Backpack", "Sunglasses", "Scarf", "Jeans", "Hoodie"] },
];

// --- GENERATOR FUNCTION (Used only for initial seed) ---
function generateProducts(count) {
    const products = [];
    for (let i = 1; i <= count; i++) {
        const categoryObj = categories[Math.floor(Math.random() * categories.length)];
        const category = categoryObj.id;
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const mat = materials[Math.floor(Math.random() * materials.length)];
        const noun = categoryObj.nouns[Math.floor(Math.random() * categoryObj.nouns.length)];
        const name = `${adj} ${mat} ${noun}`;
        const price = (Math.random() * (500 - 20) + 20).toFixed(2);
        const imagePool = categoryImages[category];
        const image = imagePool[Math.floor(Math.random() * imagePool.length)] || imagePool[0]; // Fallback

        products.push({
            id: Date.now() + i, // Unique ID based on time + index to avoid collisions
            name: name,
            category: category,
            price: parseFloat(price),
            image: image,
            rating: (Math.random() * (5 - 3) + 3).toFixed(1)
        });
    }
    return products;
}

// --- INITIALIZATION LOGIC ---
function initializeData() {
    // 1. Try to get data from LocalStorage
    const storedProducts = localStorage.getItem('productsData');
    
    if (storedProducts) {
        // Data exists! Parse and return it.
        return JSON.parse(storedProducts);
    } else {
        // No data found (first run). Generate and Save.
        const seedData = generateProducts(PRODUCT_COUNT);
        localStorage.setItem('productsData', JSON.stringify(seedData));
        return seedData;
    }
}

// Export the data variable that app.js expects
const productsData = initializeData();
console.log(`Loaded ${productsData.length} products from storage.`);