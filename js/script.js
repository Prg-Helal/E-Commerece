// DOM Elements
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('show-signup');
const cartBtn = document.getElementById('cart-btn');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const closeModals = document.querySelectorAll('.close-modal');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const checkoutBtn = document.getElementById('checkout-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');
const langEnBtn = document.getElementById('lang-en');
const langArBtn = document.getElementById('lang-ar');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const themeToggle = document.getElementById('theme-toggle');
const categoryFilter = document.getElementById('category-filter');
const sortBy = document.getElementById('sort-by');
const navbarToggler = document.getElementById('navbar-toggler');
const navbarCollapse = document.getElementById('navbar-collapse');
const searchSuggestions = document.getElementById('search-suggestions');

// Cart State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let filteredProducts = [...products];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js for hero section
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#ffffff" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
                move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" }
                }
            }
        });
    }

    // Load initial data
    loadCategories();
    loadProducts();
    updateCartCount();
    setupEventListeners();
    renderCartItems();

    // Initialize theme and language
    initializeTheme();
    initializeLanguage();
});

// Initialize theme from localStorage
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update toggle icon
    const icon = themeToggle.querySelector('i');
    icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Initialize language from localStorage
function initializeLanguage() {
    const savedLanguage = localStorage.getItem('language') || 'en';
    switchLanguage(savedLanguage);
    
    // Update language toggle buttons
    if (savedLanguage === 'en') {
        langEnBtn.classList.add('active');
        langArBtn.classList.remove('active');
    } else {
        langArBtn.classList.add('active');
        langEnBtn.classList.remove('active');
    }
}

// Load categories
function loadCategories() {
    const categoryContainer = document.getElementById('category-container');
    const categoryFilter = document.getElementById('category-filter');
    
    if (!categoryContainer || !categoryFilter) return;
    
    // Get unique categories from products
    const categories = [...new Set(products.map(product => product.category))];
    
    // Clear existing options except the first one
    while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
    }
    
    // Add categories to filter dropdown
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    // Add category cards
    categoryContainer.innerHTML = '';
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.innerHTML = `
            <div class="category-img">
                <i class="fas fa-${getCategoryIcon(category)}"></i>
            </div>
            <div class="category-info">
                <h3>${category}</h3>
                <p>${products.filter(p => p.category === category).length} ${translations[document.documentElement.lang].products}</p>
            </div>
        `;
        categoryContainer.appendChild(categoryCard);
        
        // Add click event to filter by category
        categoryCard.addEventListener('click', () => {
            filterProducts(category);
            categoryFilter.value = category;
        });
    });
}

// Get icon for category
function getCategoryIcon(category) {
    const icons = {
        'Electronics': 'laptop',
        'Smartphones': 'mobile-alt',
        'Accessories': 'headphones',
        'Home Appliances': 'tv',
        'Gaming': 'gamepad',
        'Cameras': 'camera'
    };
    return icons[category] || 'shopping-bag';
}

// Load products
function loadProducts() {
    const productContainer = document.getElementById('product-container');
    if (!productContainer) return;
    
    productContainer.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-price">
                    <div>
                        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                        <span class="price">$${product.price.toFixed(2)}</span>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> <span data-translate="addToCart">Add to Cart</span>
                    </button>
                </div>
            </div>
        `;
        productContainer.appendChild(productCard);
    });

    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Filter products by category
function filterProducts(category = 'all') {
    if (category === 'all') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    sortProducts(sortBy.value);
    loadProducts();
}

// Sort products
function sortProducts(sortType) {
    switch(sortType) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            filteredProducts = [...products];
    }
    loadProducts();
}

// Search products
function searchProducts(query) {
    if (!query) {
        filteredProducts = [...products];
    } else {
        const lowerQuery = query.toLowerCase();
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(lowerQuery) || 
            product.description.toLowerCase().includes(lowerQuery) ||
            product.category.toLowerCase().includes(lowerQuery)
        );
    }
    loadProducts();
}

// Set up event listeners
function setupEventListeners() {
    // Modal toggles
    if (loginBtn) loginBtn.addEventListener('click', () => loginModal.style.display = 'flex');
    if (signupBtn) signupBtn.addEventListener('click', () => {
        loginModal.style.display = 'none';
        signupModal.style.display = 'flex';
    });
    if (cartBtn) cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        closeMobileNav();
    });
    
    // Close modals
    if (closeModals) {
        closeModals.forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('.modal').style.display = 'none';
            });
        });
    }
    
    // Close cart
    if (closeCart) closeCart.addEventListener('click', () => cartSidebar.classList.remove('active'));
    
    // Clear cart
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            cart = [];
            updateCart();
            showAlert(translations[document.documentElement.lang].cartCleared, 'success');
        });
    }
    
    // Checkout button
    if (checkoutBtn) checkoutBtn.addEventListener('click', proceedToCheckout);
    
    // Language switch
    if (langEnBtn) langEnBtn.addEventListener('click', () => switchLanguage('en'));
    if (langArBtn) langArBtn.addEventListener('click', () => switchLanguage('ar'));
    
    // Theme toggle
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    
    // Search functionality
    if (searchBtn) searchBtn.addEventListener('click', () => searchProducts(searchInput.value));
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchProducts(this.value);
        });
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                showSearchSuggestions(this.value);
            }, 300);
        });
        searchInput.addEventListener('focus', function() {
            if (this.value.length > 0) {
                showSearchSuggestions(this.value);
            }
        });
        searchInput.addEventListener('blur', function() {
            setTimeout(() => {
                searchSuggestions.classList.remove('show');
            }, 200);
        });
    }
    
    // Filter and sort
    if (categoryFilter) categoryFilter.addEventListener('change', (e) => filterProducts(e.target.value));
    if (sortBy) sortBy.addEventListener('change', (e) => sortProducts(e.target.value));
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) loginModal.style.display = 'none';
        if (e.target === signupModal) signupModal.style.display = 'none';
    });
    
    // Form submissions
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('#login-email').value;
            const password = this.querySelector('#login-password').value;
            
            // Basic validation
            if (!email || !password) {
                showAlert(translations[document.documentElement.lang].fillAllFields, 'error');
                return;
            }
            
            // Simulate login
            showAlert(translations[document.documentElement.lang].loginSuccess, 'success');
            loginModal.style.display = 'none';
            loginForm.reset();
        });
    }
    
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const firstname = this.querySelector('#signup-firstname').value;
            const lastname = this.querySelector('#signup-lastname').value;
            const email = this.querySelector('#signup-email').value;
            const password = this.querySelector('#signup-password').value;
            const repeatPassword = this.querySelector('#signup-repeat-password').value;
            const country = this.querySelector('#signup-country').value;
            const address = this.querySelector('#signup-address').value;
            
            // Basic validation
            if (!firstname || !lastname || !email || !password || !repeatPassword || !country || !address) {
                showAlert(translations[document.documentElement.lang].fillAllFields, 'error');
                return;
            }
            
            if (password !== repeatPassword) {
                showAlert(translations[document.documentElement.lang].passwordsNotMatch, 'error');
                return;
            }
            
            // Simulate signup
            showAlert(translations[document.documentElement.lang].accountCreated, 'success');
            signupModal.style.display = 'none';
            signupForm.reset();
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-page');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Close mobile nav
                closeMobileNav();
            }
        });
    });
    
    // Initialize navbar
    initNavbar();
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update toggle icon
    const icon = themeToggle.querySelector('i');
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Switch language
function switchLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('language', lang);
    
    // Update translations
    updateTranslations(lang);
    
    // Update language toggle buttons
    if (lang === 'en') {
        langEnBtn.classList.add('active');
        langArBtn.classList.remove('active');
    } else {
        langArBtn.classList.add('active');
        langEnBtn.classList.remove('active');
    }
    
    // Reload categories and products to update translations
    loadCategories();
    loadProducts();
    renderCartItems();
}

// Update translations
function updateTranslations(lang) {
    for (const [key, value] of Object.entries(translations[lang])) {
        document.querySelectorAll(`[data-translate="${key}"]`).forEach(el => {
            el.textContent = value;
        });
        document.querySelectorAll(`[data-translate-placeholder="${key}"]`).forEach(el => {
            el.placeholder = value;
        });
    }
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCart();
    showAlert(`<i class="fas fa-cart-plus"></i> ${product.name} ${translations[document.documentElement.lang].addedToCart}`, 'success');
}

function removeFromCart(productId) {
    const product = cart.find(item => item.id === productId);
    if (!product) return;
    
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showAlert(`${product.name} ${translations[document.documentElement.lang].removedFromCart}`, 'success');
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
    document.getElementById('cart-item-count').textContent = count;
    document.getElementById('cart-subtotal').textContent = `$${getCartTotal().toFixed(2)}`;
}

// Render cart items
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (!cartItemsContainer || !cartTotalElement) return;
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart">${translations[document.documentElement.lang].cartEmpty}</p>`;
        cartTotalElement.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
        
        total += item.price * item.quantity;
    });
    
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// Update product quantity in cart
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity < 1) {
        removeFromCart(productId);
    } else {
        updateCart();
    }
}

// Show alert/notification
function showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = message;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => {
            alert.remove();
        }, 300);
    }, 3000);
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showAlert(translations[document.documentElement.lang].cartEmpty, 'error');
        return;
    }
    
    showAlert(`${translations[document.documentElement.lang].checkoutMessage} $${getCartTotal().toFixed(2)}`, 'success');
    
    // Clear cart after checkout (simulated)
    cart = [];
    updateCart();
}

// Get cart total
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Search suggestions
let searchTimeout;

function showSearchSuggestions(query) {
    if (!query) {
        searchSuggestions.classList.remove('show');
        return;
    }

    const suggestions = getSearchSuggestions(query.toLowerCase());
    renderSearchSuggestions(suggestions);
}

function getSearchSuggestions(query) {
    if (!query) return [];
    
    return products.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    ).slice(0, 5);
}

function renderSearchSuggestions(suggestions) {
    searchSuggestions.innerHTML = '';
    
    if (suggestions.length === 0) {
        searchSuggestions.classList.remove('show');
        return;
    }

    suggestions.forEach(product => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.textContent = product.name;
        suggestionItem.addEventListener('click', () => {
            searchInput.value = product.name;
            searchProducts(product.name);
            searchSuggestions.classList.remove('show');
        });
        searchSuggestions.appendChild(suggestionItem);
    });

    searchSuggestions.classList.add('show');
}

// Navbar Toggler
function initNavbar() {
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navbarCollapse.classList.toggle('show');
            
            // Toggle icon
            const icon = this.querySelector('i');
            icon.className = isExpanded ? 'fas fa-bars' : 'fas fa-times';
            
            // Prevent scrolling when menu is open
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
            closeMobileNav();
        }
    });
}

function closeMobileNav() {
    if (navbarToggler && navbarCollapse) {
        navbarToggler.setAttribute('aria-expanded', 'false');
        navbarCollapse.classList.remove('show');
        const icon = navbarToggler.querySelector('i');
        icon.className = 'fas fa-bars';
        document.body.style.overflow = '';
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const showSignup = document.getElementById("show-signup");
    const loginModal = document.getElementById("login-modal");
    const signupModal = document.getElementById("signup-modal");
    const closeButtons = document.querySelectorAll(".close-modal");

    // لما المستخدم يدوس على "Sign up"
    showSignup.addEventListener("click", function (e) {
        e.preventDefault();
        loginModal.style.display = "none";
        signupModal.style.display = "block";
    });

    // اغلاق المودالات لما يدوس على زر الإغلاق
    closeButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            loginModal.style.display = "none";
            signupModal.style.display = "none";
        });
    });

    // اختياري: قفل المودال لما المستخدم يدوس بره المحتوى
    window.addEventListener("click", function (e) {
        if (e.target === loginModal) loginModal.style.display = "none";
        if (e.target === signupModal) signupModal.style.display = "none";
    });
});

