# E-COMMERCE-WEBSITE
# Arora E-Commerce | Premium Shopping Experience



**Arora** is a fully functional, frontend-focused E-Commerce application. It simulates a complete online shopping ecosystem—including product management, user authentication, cart logic, order tracking, and an AI support bot—entirely within the browser using `localStorage` for data persistence.

---

## 🌟 Key Features

### 🛍️ User Experience (Client Side)
* **Dynamic Product Grid:** Browsable inventory with filtering (Category) and sorting (Price Low/High).
* **Smart Search:** Real-time search functionality for products and categories.
* **Shopping Cart:** Add/remove items, coupon code application (`SAVE10`, `ARORA20`), and dynamic total calculation.
* **Checkout Simulation:** Validates payment details (UPI/Card) and generates unique Order IDs.
* **Order Tracking:** Users can track status (Placed → Packed → Shipped) using their Order ID. The status updates automatically based on time elapsed since purchase.
* **AI Chatbot:** Built-in "Arora Bot" that answers queries about shipping, returns, and tech stack using keyword logic.

### 🔐 Authentication & Admin (CMS) (Content management system)
* **Secure-ish Login System:** Functional Sign Up/Login flows with animated transitions.
* **Admin Dashboard:** A dedicated CMS (`admin.html`) to manage inventory.
* **CRUD Operations:** Admins can **Create**, **Read**, **Update**, and **Delete** products. Changes allow immediate reflection on the main shop page.
* **Analytics:** Dashboard displays total product count and total inventory value.

---

## ⚙️ How It Works (The Mechanism)

This project uses a **Serverless Architecture** simulation. Instead of a backend database (like MongoDB or SQL), it uses the browser's **Local Storage** to act as a persistent database.

### 1. The Data Persistence Layer (`data.js`)
* **Initialization:** On the first load, the app checks if `localStorage` is empty.
* **Seeding:** If empty, `data.js` generates 100 mock products (using algorithms to randomize names, prices, and categories) and saves them to browser storage.
* **Synchronization:** Both the Admin Panel and the Shop Page read from this single source of truth.

### 2. The Order Workflow
1.  **Cart:** User adds items → stored in `cart` array in Local Storage.
2.  **Checkout:** User enters payment info → App creates an **Order Object** containing a timestamp, items, and total.
3.  **Storage:** The Order Object is pushed to the `orders` array in Local Storage.
4.  **Tracking:** When a user searches an Order ID, the app retrieves the order, compares the `timestamp` with the current time, and calculates the delivery status dynamically.

### 3. The Authentication Flow
* **Sign Up:** User credentials are saved to a `users` array in Local Storage.
* **Login:** The app matches input against the stored `users` array. If a match is found, a `currentUser` session is created.
* **Protection:** Checkout is restricted to logged-in users only.

---

## 📂 Project Structure

```text
/
├── index.html          # Main Storefront (Product Grid, Cart, Chatbot)
├── admin.html          # Admin CMS (Inventory Management)
├── login.html          # Authentication Page (Login/Signup)
├── style.css           # Global Styles & Variables
├── responsive.css      # Mobile/Tablet Adjustments
├── auth-animate.css    # Animations for Login/Signup
├── chatbot.css         # Styles for the floating chat widget
├── app.js              # Core Store Logic (Cart, Filters, Checkout)
├── admin.js            # Admin Logic (CRUD Operations)
├── auth.js             # Authentication Handler
├── chatbot.js          # Chatbot Logic (Keyword-Response System)
├── data.js             # Data Seeding & Initialization
└── README.md           # Documentation
