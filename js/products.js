// Sample product data
const products = [
    {
        id: 1,
        name: "Smartphone X Pro",
        description: "Latest flagship smartphone with 6.7\" AMOLED display and triple camera system.",
        price: 899.99,
        oldPrice: 999.99,
        image: "./imgs/Apple Store Online.jpg",
        badge: "Sale",
        category: "Smartphones",
        ratings: [{ stars: 3, comment: "Good but not great." }]
    },
    {
        id: 2,
        name: "Wireless Earbuds",
        description: "Premium wireless earbuds with active noise cancellation and 30hr battery life.",
        price: 199.99,
        image: "./imgs/Wireless Airbods.jpg",
        category: "Accessories",
        ratings: [{ stars: 3, comment: "Good but not great." }]
    },
    {
        id: 3,
        name: "4K Ultra HD TV",
        description: "65\" 4K Smart TV with HDR and built-in streaming apps.",
        price: 1299.99,
        oldPrice: 1499.99,
        image: "./imgs/Smart Tv.jpg",
        badge: "Popular",
        category: "Home Appliances",
        ratings: [{ stars: 3, comment: "Good but not great." }]
    },
    {
        id: 4,
        name: "Gaming Laptop",
        description: "High-performance gaming laptop with RTX 3080 and 240Hz display.",
        price: 2499.99,
        image: "./imgs/Gaming Laptop.jpg",
        category: "Electronics",
        ratings: [{ stars: 3, comment: "Good but not great." }]
    },
    {
        id: 5,
        name: "Smart Watch",
        description: "Fitness tracker with heart rate monitor and 7-day battery life.",
        price: 159.99,
        oldPrice: 199.99,
        image: "./imgs/Smart Watch.jpg",
        category: "Accessories",
        ratings: [{ stars: 3, comment: "Good but not great." }]
    },
    {
        id: 6,
        name: "DSLR Camera",
        description: "Professional 24MP DSLR camera with 4K video recording.",
        price: 899.99,
        image: "./imgs/Camera.jpg",
        category: "Cameras",
        ratings: []
    },
    {
        id: 7,
        name: "Bluetooth Speaker",
        description: "Portable waterproof speaker with 20hr playtime.",
        price: 129.99,
        image: "./imgs/Bluetooth Speaker.jpg",
        category: "Accessories",
        ratings: []
    },
    {
        id: 8,
        name: "Tablet Pro",
        description: "10.5\" tablet with stylus support and all-day battery.",
        price: 499.99,
        oldPrice: 599.99,
        image: "./imgs/Tablet Pro.jpg",
        badge: "New",
        category: "Electronics",
        ratings: []
    }
];
// تعديل دالة filterProducts
function filterProducts(category = 'all', updateURL = true) {
    // حفظ القسم المحدد في localStorage
    localStorage.setItem('selectedCategory', category);
    
    // تصفية المنتجات
    if (category === 'all') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    // تحديث URL إذا طُلب
    if (updateURL && window.location.pathname.includes('products.html')) {
        const url = new URL(window.location);
        if (category === 'all') {
            url.searchParams.delete('category');
        } else {
            url.searchParams.set('category', category);
        }
        window.history.pushState({}, '', url);
    }
    
    // إعادة تحميل المنتجات
    loadProducts();
}

// تعديل دالة setupProductsEventListeners
function setupProductsEventListeners() {
    // فلتر الأقسام
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            filterProducts(e.target.value);
        });
    }
    
    // البحث والترتيب
    if (sortBy) {
        sortBy.addEventListener('change', (e) => {
            sortProducts(e.target.value);
        });
    }
    
    // بقية المستمعين...
}
