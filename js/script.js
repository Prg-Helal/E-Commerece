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
    // loadProducts();
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
function loadProducts() {
    const productContainer = document.getElementById('product-container');
    if (!productContainer) return;
    
    productContainer.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productContainer.innerHTML = `
            <div class="no-products">
                <i class="fas fa-box-open"></i>
                <h3>${translations[document.documentElement.lang].noProducts}</h3>
                <p>${translations[document.documentElement.lang].productsComingSoon}</p>
            </div>
        `;
        return;
    }
    
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
                        <i class="fas fa-cart-plus"></i> <span data-translate="addToCart">${translations[document.documentElement.lang].addToCart}</span>
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

document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
});

function loadCategories() {
    const categoryContainer = document.getElementById('category-container');
    if (!categoryContainer) return;

    // احصل على الأقسام الفريدة من المنتجات
    const categories = [...new Set(products.map(product => product.category))];
    
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
                <p>${products.filter(p => p.category === category).length} منتجات</p>
            </div>
        `;
        
        // إضافة حدث النقر للتصفية حسب القسم
        categoryCard.addEventListener('click', () => {
            localStorage.setItem('selectedCategory', category);
            window.location.href = 'products.html';
        });
        
        categoryContainer.appendChild(categoryCard);
    });
}

function getCategoryIcon(category) {
    const icons = {
        'Smartphones': 'mobile-alt',
        'Electronics': 'laptop',
        'Accessories': 'headphones',
        // أضف المزيد حسب الحاجة
    };
    return icons[category] || 'shopping-bag';
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

// Filter Products 
function filterProducts(category = 'all', updateURL = true) {
    if (category === 'all') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    // Update URL if needed
    if (updateURL) {
        const url = new URL(window.location);
        if (category === 'all') {
            url.searchParams.delete('category');
        } else {
            url.searchParams.set('category', category);
        }
        window.history.pushState({}, '', url);
    }
    
    // Sort and load products
    sortProducts(sortBy.value);
    loadProducts();
}

categoryCard.addEventListener('click', () => {
    localStorage.setItem('selectedCategory', category);
    window.location.href = 'products.html';
});
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
            // Keep current filter but don't reset to all products
            break;
    }
    loadProducts();
}


// Search products
function searchProducts(query) {
    if (!query) {
        // If search is empty, return to current category filter
        const currentCategory = localStorage.getItem('selectedCategory') || 'all';
        filterProducts(currentCategory);
        return;
    }
    
    const lowerQuery = query.toLowerCase();
    filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) || 
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );
    
    if (filteredProducts.length === 0) {
        const productContainer = document.getElementById('product-container');
        productContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>${translations[document.documentElement.lang].noResults}</h3>
                <p>${translations[document.documentElement.lang].tryDifferentKeywords}</p>
            </div>
        `;
    } else {
        loadProducts();
    }
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
if (searchInput) {
    let searchTimeout;
    
    // البحث أثناء الكتابة مع تأخير 300ms
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = this.value.trim();
            if (query.length > 0) {
                showSearchSuggestions(query);
            } else {
                searchSuggestions.classList.remove('show');
                // إعادة تحميل المنتجات الأصلية إذا كان الحقل فارغاً
                if (window.location.pathname.includes('products.html')) {
                    filteredProducts = [...products];
                    loadProducts();
                }
            }
        }, 300);
    });

    // تنفيذ البحث عند الضغط على Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim();
            if (query.length > 0) {
                executeSearch(query);
            }
        }
    });

    // إظهار الاقتراحات عند التركيز على حقل البحث
    searchInput.addEventListener('focus', function() {
        const query = this.value.trim();
        if (query.length > 0) {
            showSearchSuggestions(query);
        }
    });

    // إخفاء الاقتراحات عند فقدان التركيز (مع تأخير)
    searchInput.addEventListener('blur', function() {
        setTimeout(() => {
            searchSuggestions.classList.remove('show');
        }, 200);
    });

    // تنفيذ البحث عند النقر على زر البحث
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query.length > 0) {
                executeSearch(query);
            }
        });
    }
}

// دالة لعرض اقتراحات البحث
function showSearchSuggestions(query) {
    const suggestions = getSearchSuggestions(query.toLowerCase());
    renderSearchSuggestions(suggestions);
}

// دالة للحصول على اقتراحات البحث
function getSearchSuggestions(query) {
    if (!query) return [];
    
    return products.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    ).slice(0, 5);
}

// دالة لعرض نتائج الاقتراحات
function renderSearchSuggestions(suggestions) {
    searchSuggestions.innerHTML = '';
    
    if (suggestions.length === 0) {
        searchSuggestions.classList.remove('show');
        return;
    }

    suggestions.forEach(product => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.innerHTML = `
            <i class="fas fa-search"></i>
            <span>${product.name}</span>
        `;
        suggestionItem.addEventListener('mousedown', (e) => {
            e.preventDefault(); // منع فقدان التركيز من الحقل
            searchInput.value = product.name;
            executeSearch(product.name);
        });
        searchSuggestions.appendChild(suggestionItem);
    });

    searchSuggestions.classList.add('show');
}

// دالة لتنفيذ البحث
function executeSearch(query) {
    // إذا كنا في صفحة المنتجات، نفذ البحث مباشرة
    if (window.location.pathname.includes('products.html')) {
        searchProducts(query);
        searchSuggestions.classList.remove('show');
    } 
    // إذا كنا في صفحة أخرى، انتقل إلى صفحة المنتجات مع حفظ كلمة البحث
    else {
        localStorage.setItem('searchQuery', query);
        window.location.href = 'products.html';
    }
}

// دالة البحث الفعلية في صفحة المنتجات
    
    // Filter and sort
    // if (categoryFilter) categoryFilter.addEventListener('change', (e) => filterProducts(e.target.value));
    // في دالة setupEventListeners()
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            filterProducts(e.target.value);
        });
    }
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
    document.addEventListener('DOMContentLoaded', () => {
        const navLinks = document.querySelectorAll('.nav-link');
    
        // الحصول على اسم الصفحة الحالية من الـ URL
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
        // إضافة كلاس active للرابط المناسب بناءً على الصفحة الحالية
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
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

    showSignup.addEventListener("click", function (e) {
        e.preventDefault();
        loginModal.style.display = "none";
        signupModal.style.display = "block";
    });

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

// 3. دالة تصفية المنتجات حسب القسم
// function filterProducts(category = 'all') {
//     if (category === 'all') {
//         filteredProducts = [...products];
//     } else {
//         filteredProducts = products.filter(product => product.category === category);
//     }
    
//     if (filteredProducts.length === 0) {
//         document.getElementById('product-container').innerHTML = `
//             <div class="no-products">
//                 <i class="fas fa-box-open"></i>
//                 <h3>${translations[document.documentElement.lang].noProducts}</h3>
//                 <p>${translations[document.documentElement.lang].productsComingSoon}</p>
//             </div>
//         `;
//     } else {
//         loadProducts();
//     }
// }

// في دالة setupEventListeners()
// if (categoryFilter) {
//     categoryFilter.addEventListener('change', (e) => {
//         filterProducts(e.target.value);
        
//         // تحديث عنوان URL بدون إعادة تحميل الصفحة
//         const url = new URL(window.location);
//         url.searchParams.set('category', e.target.value);
//         window.history.pushState({}, '', url);
//     });
// }

// // في document.addEventListener('DOMContentLoaded', ...)
// // معالجة معلمات URL عند تحميل الصفحة
// const urlParams = new URLSearchParams(window.location.search);
// const urlCategory = urlParams.get('category');

// if (urlCategory) {
//     localStorage.setItem('selectedCategory', urlCategory);
    
//     // تحديث قيمة الفلتر إذا كان موجوداً
//     const categoryFilter = document.getElementById('category-filter');
//     if (categoryFilter) {
//         categoryFilter.value = urlCategory;
//     }
// }
// في document.addEventListener('DOMContentLoaded', ...)
// معالجة معلمات URL عند تحميل الصفحة
const urlParams = new URLSearchParams(window.location.search);
const urlCategory = urlParams.get('category');

if (urlCategory) {
    localStorage.setItem('selectedCategory', urlCategory);
    
    // تحديث قيمة الفلتر إذا كان موجوداً
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.value = urlCategory;
    }
}