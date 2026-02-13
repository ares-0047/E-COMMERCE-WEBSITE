// chatbot.js

// --- CONFIGURATION ---
const BOT_NAME = "Arora Bot";
const STARTUP_MSG = "Hello! I'm here to help. Ask me about orders, shipping, or returns. Please do remember that i can only answer about pre defined questions only, so currently i am on a limited state of power ";

// --- KNOWLEDGE BASE (Simple Rule-Based AI) ---
const knowledgeBase = [
    {
        keywords: ["hello", "hi", "hey", "start"],
        response: "Hi there! Welcome to Arora E-Commerce. How can I assist you today?"
    },
    {
        keywords: ["track", "order", "where", "status"],
        response: "You can track your order using the 'Truck' icon in the top menu. You'll need your Order ID (e.g., ORD1234)."
    },
    {
        keywords: ["return", "refund", "exchange"],
        response: "We accept returns within 7 days of purchase. Items must be unworn. Email support@arora.com to start a return."
    },
    {
        keywords: ["shipping", "delivery", "time", "long"],
        response: "Standard shipping takes 3-5 business days. Express shipping is 1-2 days.Though this is a simulation we will simulate withing 1min and 40 sec "
    },
    {
        keywords: ["payment", "pay", "card", "upi"],
        response: "We accept Credit/Debit cards, UPI, and Cash on Delivery (COD) for most locations."
    },
    {
        keywords: ["contact", "support", "help", "human", "call"],
        response: "You can reach our human support team at +91-9142184950 or email support@arora.com (Mon-Fri, 9am-6pm)."
    },
    {
        keywords: ["coupon", "discount", "code", "offer"],
        response: "Current active codes: 'SAVE10' for 10% off and 'ARORA20' for 20% off!"
    },
    {
        keywords: ["creator","created","devloped",],
        response: "i was devloped by mr.ashutosh,ms.aditi,ms,richa as an e-commerce website help and assistance AI bot"
    },
    {
        keywords: ["name"],
        response: " i am an personal AI assistance that will help you to surf throuch our website and provide help"
    },
    {
        keywords: ["how are you"],//simple replyes
        response: "I am doing greate how about you"
    },
    {
        keywords: ["what's up"],
        response: "just here to help"
    },
    {
        keywords: ["joke"],
        response: "why do programmers love dark mode?    because light attracts bugs "
    },
    {
        keywords: ["motivate"],
        response: "success starts with self belive ,geep going keep building and develope untile your hands give up"
    },
    {
        keywords: ["funfact"],
        response: "octopus have 3 hearts"
    },
    {
        keywords: ["study"],//achadmics question
        response: "maths,physics,chemistry or computer science"
    },
    {
        keywords: ["maths"],
        response: "i hate maths so no comments"
    },
    {
        keywords: ["physics"],
        response: "you can ask those questions to newton ovs after making him alive agai that is "
    },
    {
        keywords: ["chemistry"],
        response: "Oooo hooo can't say much on that"
    },
    {
        keywords: ["computerscience"],
        response: "will be available soon , as you know our developers are programmers afterall"
    },
    {
        keywords: ["what is javascript user for "],//techinical questions
        response: "java script is used to make the website responsive"
    },
    {
        keywords: ["why is python important"],
        response: "python is mostly used for automation an AI tasks"
    },
    {
        keywords: ["html"],
        response: "html is used to desine websites and its full form is hyper text markup language"
    },
    {
        keywords: ["css"],
        response: "css is used to styles the web page and its full form is cascadian style sheet"
    },
    {
        keywords: ["backend"],
        response: "backend is used to handel the server side logics"
    },
    {
        keywords: ["frontend"],
        response: "frontend what user see's"
    },
    {
        keywords: ["database"],
        response: "database simpely stores data"
    },
    {
        keywords: ["api"],
        response: "api allows communication between systems"
    },
    {
        keywords: ["i am sad"],//personal help
        response: "i am here for you you dont need to worry , want to talk about it"
    },
    {
        keywords: ["i feel lonley"],
        response: "you're not alone i will be always with you "
    },
    {
        keywords: ["i am stressed"],
        response: "take a deep breath lets handel it step by step"
    },
    {
        keywords: ["iamhappy"],
        response: "that makes me happy too"
    },
    {
        keywords: ["gym"],//about exercise
        response: "stay consstant and focus on diet"
    },
    {
        keywords: ["weightgain"],
        response: "eat calories surplus with protien"
    },
    {
        keywords: ["weightloss"],
        response: "eat less and go toward calories deficiency"
    },
    {
        keywords: ["protien"],
        response: "protien helps in building muscles"
    },
    {
        keywords: ["portfolio"],//devloper related questions from here down
        response: "a strong portfolio showes your skills,you should build one if you dont have it yet using html,css,js"  
    },
    {
        keywords: ["hackathon","what is hackathon","need of hackathon"],
        response: "hackathon is where the devlopers,coder caome together to solve a problem or build something it boosts real world experience"
    },
    {
        keywords: ["projectidea"],
        response: "try building a ai chatbot for starter using if-else if using python or keyword and responce statment if using javascript"
    },
    {
        keywords: ["github"],
        response: "keeps your reprositries clean and safe"
    },
    {
        keywords: ["thanks","thankyou","thx"],
        response: "you are welcome"
    },
    {
        keywords: ["react"],
        response: "react is a java script library for ui"
    },
    {
        keywords: ["node"],
        Response: "node js run java script on server"
    },
    {
        keywords: ["do you love me"],
        Response: "i care about helping you"
    },
    {
        keywords: ["are you single"],
        Response: "i'm commited in helping users"
    },
    {
        keywords: ["marrry me"],
        Response: "lets stay frineds"
    },
    {
        keywords: ["sing a song"],
        Response: "La la la"
    },
    {

    }
];

// --- DOM ELEMENTS ---
const chatWindow = document.getElementById('chat-window');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const typingIndicator = document.getElementById('typing-indicator');

// --- FUNCTIONS ---

function toggleChat() {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open') && chatMessages.children.length === 0) {
        // Send welcome message only on first open
        addMessage(BOT_NAME, STARTUP_MSG, 'bot');
    }
}

function handleEnter(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // 1. Add User Message
    addMessage("You", text, 'user');
    chatInput.value = '';

    // 2. Simulate Bot "Thinking"
    showTyping();

    // 3. Process Response
    setTimeout(() => {
        const reply = findResponse(text);
        addMessage(BOT_NAME, reply, 'bot');
        hideTyping();
    }, 800); // 800ms delay for realism
}

function addMessage(sender, text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', type === 'bot' ? 'bot-message' : 'user-message');
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    
    // Auto-scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
    typingIndicator.classList.add('active');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
    typingIndicator.classList.remove('active');
}

// --- AI LOGIC ---
function findResponse(input) {
    const lowerInput = input.toLowerCase();

    // Check knowledge base
    for (let item of knowledgeBase) {
        // If ANY keyword matches
        const match = item.keywords.some(keyword => lowerInput.includes(keyword));
        if (match) {
            return item.response;
        }
    }

    // Default Fallback
    return "I'm not sure about that. Try asking about 'tracking', 'shipping', or 'returns', or type 'human' for support, please do remember that i can only responce about the data i an alredy feed with as i am not a machine learning trained AI i use keyeord-responce mechanism of javascript to answer your questions";
}
