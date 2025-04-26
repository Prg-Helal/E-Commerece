// Initialize ratings in localStorage if not exists
function initializeRatings() {
    console.log('Initializing ratings...');
    if (!localStorage.getItem('productRatings')) {
        const initialRatings = {};
        if (!products || !Array.isArray(products)) {
            console.error('Products array is undefined or not an array');
            return;
        }
        products.forEach(product => {
            initialRatings[product.id] = product.ratings || [];
        });
        try {
            localStorage.setItem('productRatings', JSON.stringify(initialRatings));
            console.log('Ratings initialized in localStorage:', initialRatings);
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    } else {
        console.log('productRatings already exists in localStorage');
    }
}

// Get ratings for a product
function getProductRatings(productId) {
    try {
        const ratings = JSON.parse(localStorage.getItem('productRatings')) || {};
        const productRatings = ratings[productId] || [];
        console.log(`Ratings for product ${productId}:`, productRatings);
        return productRatings;
    } catch (e) {
        console.error('Error reading productRatings from localStorage:', e);
        return [];
    }
}

// Add a new rating
function addProductRating(productId, stars, comment = '') {
    console.log(`Adding rating for product ${productId}: ${stars} stars, comment: ${comment}`);
    try {
        const ratings = JSON.parse(localStorage.getItem('productRatings')) || {};
        if (!ratings[productId]) {
            ratings[productId] = [];
        }
        ratings[productId].push({ stars: parseInt(stars), comment });
        localStorage.setItem('productRatings', JSON.stringify(ratings));
        console.log(`Updated ratings for product ${productId}:`, ratings[productId]);
        showAlert(translations[document.documentElement.lang].ratingAdded, 'success');
        loadProducts(); // Reload products to update ratings
    } catch (e) {
        console.error('Error adding rating to localStorage:', e);
        showAlert('Failed to add rating. Please try again.', 'error');
    }
}

// Calculate average rating
function getAverageRating(ratings) {
    if (!ratings || ratings.length === 0) {
        console.log('No ratings available, returning 0');
        return 0;
    }
    const total = ratings.reduce((sum, rating) => sum + rating.stars, 0);
    const average = (total / ratings.length).toFixed(1);
    console.log('Calculated average rating:', average);
    return average;
}

// Render star rating
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    let starsHTML = '';
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHTML += '<i class="fas fa-star"></i>';
        } else if (i < fullStars + halfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        } else {
            starsHTML += '<i class="far fa-star"></i>';
        }
    }
    console.log('Rendered stars for rating:', rating, starsHTML);
    return starsHTML;
}

// Existing variables and other functions
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
let filteredProducts = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing page...');
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

    // Handle URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const urlCategory = urlParams.get('category');
    const searchQuery = localStorage.getItem('searchQuery');
    
    // Set initial category
    let initialCategory = 'all';
    if (urlCategory) {
        initialCategory = urlCategory;
        localStorage.setItem('selectedCategory', urlCategory);
    } else if (localStorage.getItem('selectedCategory')) {
        initialCategory = localStorage.getItem('selectedCategory');
    }

    // Load data
    if (products && products.length > 0) {
        filteredProducts = [...products];
        // Apply category filter immediately
        if (window.location.pathname.includes('products.html')) {
            filterProducts(initialCategory, false);
            if (categoryFilter) {
                categoryFilter.value = initialCategory;
            }
        }
        loadCategories(initialCategory);
        loadProducts();
    } else {
        console.warn("Products array is empty or undefined.");
    }

    // Initialize ratings
    initializeRatings();

    // Handle search query
    if (searchQuery && window.location.pathname.includes('products.html')) {
        searchInput.value = searchQuery;
        searchProducts(searchQuery);
        localStorage.removeItem('searchQuery');
    }

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
function loadCategories(selectedCategory = 'all') {
    const categoryContainer = document.getElementById('category-container');
    const categoryFilter = document.getElementById('category-filter');
    
    if (categoryContainer) {
        // Get unique categories from products
        const categories = [...new Set(products.map(product => product.category))];
        
        // Clear existing category cards
        categoryContainer.innerHTML = '';
        
        // Add category cards
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
            
            // Add click event to filter by category
            categoryCard.addEventListener('click', () => {
                localStorage.setItem('selectedCategory', category);
                window.location.href = `products.html?category=${encodeURIComponent(category)}`;
            });
            
            categoryContainer.appendChild(categoryCard);
        });
    }
    
    if (categoryFilter) {
        // Clear existing options except the first one
        while (categoryFilter.options.length > 1) {
            categoryFilter.remove(1);
        }
        
        // Get unique categories from products
        const categories = [...new Set(products.map(product => product.category))];
        
        // Add categories to filter dropdown
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        
        // Set selected category
        categoryFilter.value = selectedCategory;
    }
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
    if (!productContainer) {
        console.error('Product container not found');
        return;
    }
    
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
        const ratings = getProductRatings(product.id);
        const averageRating = getAverageRating(ratings);
        
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
                <div class="product-rating">
                    <span class="stars">${renderStars(averageRating)}</span>
                    <span class="rating-value">(${averageRating} / 5) - ${ratings.length} ${translations[document.documentElement.lang].reviews}</span>
                </div>
                <div class="product-price">
                    <div>
                        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                        <span class="price">$${product.price.toFixed(2)}</span>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> <span data-translate="addToCart">${translations[document.documentElement.lang].addToCart}</span>
                    </button>
                </div>
                <div class="product-review-form">
                    <h4 data-translate="addReview">${translations[document.documentElement.lang].addReview}</h4>
                    <form class="review-form" data-product-id="${product.id}">
                        <div class="star-rating">
                            <label data-translate="yourRating">${translations[document.documentElement.lang].yourRating}</label>
                            <div class="stars-input">
                                <input type="radio" name="stars" value="5" id="stars5-${product.id}" required><label for="stars5-${product.id}"><i class="fas fa-star"></i></label>
                                <input type="radio" name="stars" value="4" id="stars4-${product.id}"><label for="stars4-${product.id}"><i class="fas fa-star"></i></label>
                                <input type="radio" name="stars" value="3" id="stars3-${product.id}"><label for="stars3-${product.id}"><i class="fas fa-star"></i></label>
                                <input type="radio" name="stars" value="2" id="stars2-${product.id}"><label for="stars2-${product.id}"><i class="fas fa-star"></i></label>
                                <input type="radio" name="stars" value="1" id="stars1-${product.id}"><label for="stars1-${product.id}"><i class="fas fa-star"></i></label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="review-comment-${product.id}" data-translate="optionalComment">${translations[document.documentElement.lang].optionalComment}</label>
                            <textarea id="review-comment-${product.id}" placeholder="${translations[document.documentElement.lang].optionalComment}" rows="3"></textarea>
                        </div>
                        <button type="submit" data-translate="submitReview">${translations[document.documentElement.lang].submitReview}</button>
                    </form>
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

    // Add event listeners to review forms
    document.querySelectorAll('.review-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const productId = parseInt(this.getAttribute('data-product-id'));
            const starsInput = this.querySelector('input[name="stars"]:checked');
            const stars = starsInput ? starsInput.value : null;
            const comment = this.querySelector(`#review-comment-${productId}`).value.trim();
            
            console.log(`Form submitted for product ${productId}, stars: ${stars}, comment: ${comment}`);
            
            if (!stars) {
                showAlert(translations[document.documentElement.lang].fillAllFields, 'error');
                return;
            }
            
            addProductRating(productId, stars, comment);
            this.reset();
        });
    });
}

// Filter products by category
function filterProducts(category = 'all', updateURL = true) {
    console.log(`Filtering products by category: ${category}`);
    localStorage.setItem('selectedCategory', category);
    
    if (category === 'all') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    if (updateURL && window.location.pathname.includes('products.html')) {
        const url = new URL(window.location);
        if (category === 'all') {
            url.searchParams.delete('category');
        } else {
            url.searchParams.set('category', category);
        }
        window.history.pushState({}, '', url);
    }
    
    sortProducts(sortBy ? sortBy.value : 'default');
    loadProducts();
}

// Sort products
function sortProducts(sortType) {
    console.log(`Sorting products by: ${sortType}`);
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
            // Keep current order
            break;
    }
    loadProducts();
}

// Search products
function searchProducts(query) {
    console.log(`Searching products with query: ${query}`);
    if (!query) {
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
    console.log('Setting up event listeners...');
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
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = this.value.trim();
                if (query.length > 0) {
                    showSearchSuggestions(query);
                    if (window.location.pathname.includes('products.html')) {
                        searchProducts(query);
                    } else {
                        localStorage.setItem('searchQuery', query);
                        window.location.href = 'products.html';
                    }
                } else {
                    searchSuggestions.classList.remove('show');
                    const currentCategory = localStorage.getItem('selectedCategory') || 'all';
                    filterProducts(currentCategory);
                }
            }, 300);
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query.length > 0) {
                    executeSearch(query);
                }
            }
        });

        searchInput.addEventListener('focus', function() {
            const query = this.value.trim();
            if (query.length > 0) {
                showSearchSuggestions(query);
            }
        });

        searchInput.addEventListener('blur', function() {
            setTimeout(() => {
                searchSuggestions.classList.remove('show');
            }, 200);
        });

        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                const query = searchInput.value.trim();
                if (query.length > 0) {
                    executeSearch(query);
                }
            });
        }
    }
    
    // Filter and sort
    setupProductsEventListeners();
    
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
            
            if (!email || !password) {
                showAlert(translations[document.documentElement.lang].fillAllFields, 'error');
                return;
            }
            
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
            
            if (!firstname || !lastname || !email || !password || !repeatPassword || !country || !address) {
                showAlert(translations[document.documentElement.lang].fillAllFields, 'error');
                return;
            }
            
            if (password !== repeatPassword) {
                showAlert(translations[document.documentElement.lang].passwordsNotMatch, 'error');
                return;
            }
            
            showAlert(translations[document.documentElement.lang].accountCreated, 'success');
            signupModal.style.display = 'none';
            signupForm.reset();
        });
    }
    
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Initialize navbar
    initNavbar();
}

// Setup products event listeners
function setupProductsEventListeners() {
    console.log('Setting up products event listeners...');
    // Filter by category
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            filterProducts(e.target.value);
        });
    }
    
    // Sort products
    if (sortBy) {
        sortBy.addEventListener('change', (e) => {
            sortProducts(e.target.value);
        });
    }
}

// Show search suggestions
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
            e.preventDefault();
            searchInput.value = product.name;
            executeSearch(product.name);
        });
        searchSuggestions.appendChild(suggestionItem);
    });

    searchSuggestions.classList.add('show');
}

function executeSearch(query) {
    if (window.location.pathname.includes('products.html')) {
        searchProducts(query);
        searchSuggestions.classList.remove('show');
    } else {
        localStorage.setItem('searchQuery', query);
        window.location.href = 'products.html';
    }
}

// Switch language
function switchLanguage(lang) {
    console.log(`Switching language to: ${lang}`);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('language', lang);
    updateTranslations(lang);
    
    if (lang === 'en') {
        langEnBtn.classList.add('active');
        langArBtn.classList.remove('active');
    } else {
        langArBtn.classList.add('active');
        langEnBtn.classList.remove('active');
    }
    
    loadCategories(localStorage.getItem('selectedCategory') || 'all');
    loadProducts();
    renderCartItems();
}

// Update translations
function updateTranslations(lang) {
    console.log(`Updating translations for language: ${lang}`);
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
    console.log(`Adding product ${productId} to cart`);
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error(`Product with ID ${productId} not found`);
        return;
    }
    
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
    console.log(`Removing product ${productId} from cart`);
    const product = cart.find(item => item.id === productId);
    if (!product) return;
    
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showAlert(`${product.name} ${translations[document.documentElement.lang].removedFromCart}`, 'success');
}

function updateCart() {
    console.log('Updating cart in localStorage');
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

function updateCartCount() {
    console.log('Updating cart count');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
    document.getElementById('cart-item-count').textContent = count;
    document.getElementById('cart-subtotal').textContent = `$${getCartTotal().toFixed(2)}`;
}

// Render cart items
function renderCartItems() {
    console.log('Rendering cart items');
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
    console.log(`Updating quantity for product ${productId} by ${change}`);
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
    console.log(`Showing alert: ${message}, type: ${type}`);
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
    console.log('Proceeding to checkout');
    if (cart.length === 0) {
        showAlert(translations[document.documentElement.lang].cartEmpty, 'error');
        return;
    }
    
    showAlert(`${translations[document.documentElement.lang].checkoutMessage} $${getCartTotal().toFixed(2)}`, 'success');
    cart = [];
    updateCart();
}

// Get cart total
function getCartTotal() {
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    console.log('Cart total:', total);
    return total;
}

// Navbar Toggler
function initNavbar() {
    console.log('Initializing navbar');
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navbarCollapse.classList.toggle('show');
            
            const icon = this.querySelector('i');
            icon.className = isExpanded ? 'fas fa-bars' : 'fas fa-times';
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });
    }
    
    document.addEventListener('click', function(e) {
        if (!navbarCollapse.contains(e.target)) {
            closeMobileNav();
        }
    });
}

function closeMobileNav() {
    console.log('Closing mobile nav');
    if (navbarToggler && navbarCollapse) {
        navbarToggler.setAttribute('aria-expanded', 'false');
        navbarCollapse.classList.remove('show');
        const icon = navbarToggler.querySelector('i');
        icon.className = 'fas fa-bars';
        document.body.style.overflow = '';
    }
}

// Toggle theme
function toggleTheme() {
    console.log('Toggling theme');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icon = themeToggle.querySelector('i');
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}