const ALL_SHOPS = [
    { id: 1, name: "Rayhon Milliy Taomlari", category: "kafe", desc: "Palov, Shashlik, Somsa" },
    { id: 2, name: "Zarafshon Restaurant", category: "kafe", desc: "Yevropa taomlari & Steyk" },
    { id: 3, name: "Havas Supermarket", category: "oziq_ovqat", desc: "Arzon va sifatli mahsulotlar" },
    { id: 4, name: "MediaPark Navoiy", category: "texnika", desc: "Telefonlar, Maishiy texnika" },
    { id: 5, name: "Ishonch Home", category: "texnika", desc: "Muddatli to'lovga barcha narsa" },
    { id: 6, name: "Terra Pro", category: "kiyim", desc: "Erkaklar zamonaviy kiyimlari" },
    { id: 7, name: "Avto-Olam", category: "avto", desc: "Ehtiyot qismlar va moylar" }
];

const SHOP_PRODUCTS = {
    1: [ { name: "Osh (Palov)", price: 35000 }, { name: "Mol go'shti shashlik", price: 18000 } ],
    2: [ { name: "T-Bone Steyk", price: 95000 }, { name: "Sezar Salati", price: 40000 } ],
    3: [ { name: "Coca-Cola 1.5L", price: 12000 }, { name: "Pringles", price: 28000 } ],
    4: [ { name: "iPhone 15 Pro", price: 14500000 }, { name: "MacBook Air M2", price: 13000000 } ],
    5: [ { name: "Artel Kir yuvish mashinasi", price: 4200000 }, { name: "Televizor 43 Lg", price: 4800000 } ],
    6: [ { name: "Premium Kostyum", price: 850000 }, { name: "Oq ko'ylak", price: 120000 } ],
    7: [ { name: "Castrol Motor Moyi", price: 380000 }, { name: "Avto Chexol", price: 450000 } ]
};

let cartCount = 0;

document.addEventListener("DOMContentLoaded", () => {
    renderShops("all");
});

function renderShops(categoryFilter) {
    const shopGrid = document.getElementById("shopGrid");
    shopGrid.innerHTML = "";

    const filtered = categoryFilter === "all" 
        ? ALL_SHOPS 
        : ALL_SHOPS.filter(shop => shop.category === categoryFilter);

    filtered.forEach(shop => {
        const card = document.createElement("div");
        card.className = "shop-card";
        card.innerHTML = `
            <div class="shop-img"></div>
            <div class="shop-info">
                <h4>${shop.name}</h4>
                <p>${shop.desc}</p>
            </div>
        `;
        
        card.addEventListener("click", () => {
            openShopMenu(shop.id, shop.name);
        });

        shopGrid.appendChild(card);
    });
}

function selectCategory(categoryName) {
    renderShops(categoryName);
}

// Do'kon mahsulotlari oynasini ochish
function openShopMenu(shopId, shopName) {
    document.getElementById("modalShopName").innerText = shopName;
    const productsList = document.getElementById("productsList");
    productsList.innerHTML = "";

    const products = SHOP_PRODUCTS[shopId] || [];
    
    products.forEach(prod => {
        const item = document.createElement("div");
        item.className = "product-item";
        item.innerHTML = `
            <div class="product-info">
                <h5>${prod.name}</h5>
                <p>${prod.price.toLocaleString()} so'm</p>
            </div>
            <button class="btn-add-cart" onclick="addToCart('${prod.name}')">Qo'shish</button>
        `;
        productsList.appendChild(item);
    });

    document.getElementById("productModal").style.display = "flex";
}

function closeShopMenu() {
    document.getElementById("productModal").style.display = "none";
}

// Savatga mahsulot qo'shish funktsiyasi
function addToCart(productName) {
    cartCount++;
    document.querySelector(".cart-count").innerText = cartCount;
    alert(`"${productName}" savatga qo'shildi!`);
}
// Savat tugmasi bosilganda buyurtmani rasmiylashtirish
document.querySelector(".btn-cart").addEventListener("click", () => {
    if (cartCount === 0) {
        alert("Savatchangiz hozircha bo'sh. Iltimos, mahsulot qo'shing!");
        return;
    }

    // Telegram WebApp orqali botga xabar yuborish
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Buyurtma ma'lumotlarini tayyorlaymiz
        const orderData = {
            total_items: cartCount,
            status: "Yangi buyurtma",
            city: "Navoiy"
        };

        // Botga ma'lumotni JSON matn ko'rinishida yuboramiz
        tg.sendData(JSON.stringify(orderData));
        tg.close(); // Ma'lumot ketgach WebApp oynasini yopish
    } else {
        alert(`Siz brauzerdasiz. Telegram ichida bo'lganingizda ushbu ${cartCount} ta mahsulot botga yuborilgan bo'lar edi!`);
    }
});
