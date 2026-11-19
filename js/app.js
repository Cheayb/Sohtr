const WHATSAPP_NUMBER = "212600000000";

const products = [
  {
    id: 1,
    name: "حذاء رياضي Air Runner",
    price: 349,
    category: "sport",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    sizes: [40, 41, 42, 43, 44]
  },
  {
    id: 2,
    name: "سنيكرز Urban White",
    price: 299,
    category: "casual",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
    sizes: [39, 40, 41, 42, 43]
  },
  {
    id: 3,
    name: "حذاء جلدي Oxford Classic",
    price: 450,
    category: "classic",
    image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&q=80",
    sizes: [40, 41, 42, 43, 44]
  },
  {
    id: 4,
    name: "حذاء جري Speed Pro",
    price: 380,
    category: "sport",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
    sizes: [41, 42, 43, 44]
  }
];

let cart = [];

const productsGrid = document.getElementById("productsGrid");
const cartModal = document.getElementById("cartModal");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

function renderProducts(category = "all") {
  productsGrid.innerHTML = "";
  const filtered = category === "all"
    ? products
    : products.filter(p => p.category === category);

  filtered.forEach(product => {
    const sizeOptions = product.sizes
      .map(s => `<option value="${s}">المقاس: ${s}</option>`)
      .join("");

    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-img">
      <div class="product-info">
        <div class="product-title">${product.name}</div>
        <div class="product-price">${product.price} درهم</div>
        <select class="size-select" id="size-${product.id}">
          ${sizeOptions}
        </select>
        <button class="add-btn" onclick="addToCart(${product.id})">أضف إلى السلة</button>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const selectedSize = document.getElementById(`size-${productId}`).value;
  cart.push({ ...product, size: selectedSize });
  updateCartUI();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  cartCount.textContent = cart.length;
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        <small>المقاس: ${item.size} | ${item.price} درهم</small>
      </div>
      <button class="remove-item" onclick="removeFromCart(${index})">حذف</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartTotal.textContent = total;
}

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    renderProducts(btn.dataset.category);
  });
});

document.getElementById("openCart").onclick = () => cartModal.classList.add("open");
document.getElementById("closeCart").onclick = () => cartModal.classList.remove("open");

document.getElementById("checkoutBtn").onclick = () => {
  if (cart.length === 0) return alert("السلة فارغة!");
  const name = document.getElementById("customerName").value.trim();
  const city = document.getElementById("customerCity").value.trim();
  if (!name || !city) return alert("المرجو إدخال الاسم والمدينة.");

  let message = `السلام عليكم، أريد طلب المنتجات التالية:\n\n`;
  let total = 0;
  cart.forEach((item, i) => {
    message += `${i + 1}. ${item.name} (مقاس ${item.size}) - ${item.price} درهم\n`;
    total += item.price;
  });
  message += `\nالمجموع: ${total} درهم\nالاسم: ${name}\nالعنوان: ${city}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};

renderProducts();

