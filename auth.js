// js/auth.js

// DOM Elements
const loginBox = document.getElementById('login-box');
const signupBox = document.getElementById('signup-box');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
// Get the main container to apply animations
const authContainer = document.querySelector('.auth-container');

// --- TOGGLE FUNCTION ---
function toggleAuth() {
    loginBox.classList.toggle('hidden');
    signupBox.classList.toggle('hidden');
}

// --- ANIMATION & REDIRECT HELPER ---
function animateAndRedirect(userName) {
    // 1. Show success message temporarily on the button
    const activeForm = signupBox.classList.contains('hidden') ? loginForm : signupForm;
    const btn = activeForm.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = `Success! Redirecting...`;
    btn.style.backgroundColor = "#10b981"; // Green color
    btn.disabled = true;

    // 2. Trigger the "Throw Out" animation
    // We remove entrance anim first to ensure clean exit application
    authContainer.classList.remove('entrance-anim');
    void authContainer.offsetWidth; // Trigger reflow to restart animation system if needed
    authContainer.classList.add('auth-exit-anim');

    // 3. Wait for animation to finish (600ms defined in CSS), then redirect
    setTimeout(() => {
        // Optional: simple alert before leaving, though the button text is usually enough
        // alert(`Welcome, ${userName}!`); 
        window.location.href = "index.html";
    }, 800); // Wait slightly longer than CSS animation (0.6s) for smoothness
}


// --- HANDLE SIGNUP ---
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(u => u.email === email)) {
        alert("Email already exists! Please login.");
        return;
    }

    // Save new user
    const newUser = { name, email, pass };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto-login after signup and animate out
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    animateAndRedirect(name);
});


// --- HANDLE LOGIN ---
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.pass === pass);

    if (user) {
        // Create Session
        localStorage.setItem('currentUser', JSON.stringify(user));
        // Trigger animation instead of immediate redirect
        animateAndRedirect(user.name);
    } else {
        // Shake animation for error (optional enhancement)
        authContainer.style.animation = 'none';
        void authContainer.offsetWidth; // trigger reflow
        authContainer.style.animation = 'shake 0.4s ease';
        alert("Invalid Email or Password.");
        // Reset shake after it runs
        setTimeout(() => { authContainer.style.animation = ''; }, 400);
    }
});

// Add a quick shake keyframe to style.css dynamically for errors
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}`;
document.head.appendChild(style);