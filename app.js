const products = [
  {
    id: 1,
    name: "Sculpted Runner",
    category: "Footwear",
    price: 189,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
    desc: "A streamlined everyday runner with a sculptural silhouette and soft technical upper.",
    sizes: ["40", "41", "42", "43"],
  },
  {
    id: 2,
    name: "Studio Tote",
    category: "Accessories",
    price: 129,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
    desc: "A structured carry-all designed for workdays, weekends and everything between.",
    sizes: ["One size"],
  },
  {
    id: 3,
    name: "Essential Overshirt",
    category: "Clothing",
    price: 159,
    image:
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=85",
    desc: "Relaxed tailoring and heavyweight cotton create a versatile layer for every season.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 4,
    name: "Contour Watch",
    category: "Accessories",
    price: 249,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85",
    desc: "A minimal timepiece focused on proportion, legibility and quiet character.",
    sizes: ["One size"],
  },
  {
    id: 5,
    name: "Everyday Knit",
    category: "Clothing",
    price: 99,
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=85",
    desc: "Soft textured knitwear with an understated profile and comfortable drape.",
    sizes: ["S", "M", "L"],
  },
  {
    id: 6,
    name: "Archive Sunglasses",
    category: "Accessories",
    price: 139,
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85",
    desc: "Angular acetate frames with a timeless silhouette and UV protective lenses.",
    sizes: ["One size"],
  },
  {
    id: 7,
    name: "Minimal Loafer",
    category: "Footwear",
    price: 219,
    image:
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=900&q=85",
    desc: "A refined leather loafer balancing a clean upper with a confident sole.",
    sizes: ["40", "41", "42", "43"],
  },
  {
    id: 8,
    name: "Form Backpack",
    category: "Accessories",
    price: 179,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
    desc: "A compact architectural backpack for commutes, travel and daily carry.",
    sizes: ["One size"],
  },
];

const state = {
  category: "All",
  query: "",
  sort: "featured",
  cart: JSON.parse(localStorage.getItem("luxe-cart") || "[]"),
  wishlist: JSON.parse(localStorage.getItem("luxe-wishlist") || "[]"),
};

const $ = (s) => document.querySelector(s);
const money = (n) => `$${n.toFixed(2)}`;

function save() {
  localStorage.setItem("luxe-cart", JSON.stringify(state.cart));
  localStorage.setItem("luxe-wishlist", JSON.stringify(state.wishlist));
}

function init() {
  renderFilters();
  renderProducts();
  renderTrending();
  renderCart();
  updateCounts();
  bindUI();
  animatePage();
}

function renderFilters() {
  const cats = ["All", ...new Set(products.map((p) => p.category))];
  $("#filters").innerHTML = cats
    .map(
      (c) =>
        `<button class="filter-btn ${state.category === c ? "active" : ""}" data-category="${c}">${c}</button>`,
    )
    .join("");
  document.querySelectorAll("[data-category]").forEach((btn) =>
    btn.addEventListener("click", () => {
      state.category = btn.dataset.category;
      renderFilters();
      renderProducts();
    }),
  );
}

function filteredProducts() {
  let list = products.filter(
    (p) =>
      (state.category === "All" || p.category === state.category) &&
      `${p.name} ${p.category}`
        .toLowerCase()
        .includes(state.query.toLowerCase()),
  );
  if (state.sort === "low") list.sort((a, b) => a.price - b.price);
  if (state.sort === "high") list.sort((a, b) => b.price - a.price);
  if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

function productCard(p) {
  const wished = state.wishlist.includes(p.id);
  return `<article class="product-card" data-id="${p.id}">
    <div class="product-image">
      <button class="heart ${wished ? "active" : ""}" data-wish="${p.id}" aria-label="Wishlist">${wished ? "♥" : "♡"}</button>
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <button class="quick-add" data-add="${p.id}">QUICK ADD +</button>
    </div>
    <div class="product-meta">
      <div class="product-name">${p.name}</div>
      <div class="product-category">${p.category}</div>
      <div class="product-price">${money(p.price)}</div>
    </div>
  </article>`;
}

function renderProducts() {
  const list = filteredProducts();
  $("#productGrid").innerHTML = list.map(productCard).join("");
  $("#emptyState").classList.toggle("hidden", list.length > 0);
  bindProductEvents("#productGrid");
  revealCards();
}

function renderTrending() {
  $("#trendingGrid").innerHTML = products.slice(2, 6).map(productCard).join("");
  bindProductEvents("#trendingGrid");
}

function bindProductEvents(scope) {
  document.querySelectorAll(`${scope} [data-add]`).forEach((b) =>
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(Number(b.dataset.add));
    }),
  );
  document.querySelectorAll(`${scope} [data-wish]`).forEach((b) =>
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleWishlist(Number(b.dataset.wish));
    }),
  );
  document.querySelectorAll(`${scope} .product-card`).forEach((card) =>
    card.addEventListener("click", () => {
      openProduct(Number(card.dataset.id));
    }),
  );
}

function addToCart(id) {
  const item = state.cart.find((x) => x.id === id);
  if (item) item.qty++;
  else
    state.cart.push({
      id,
      qty: 1,
      size: products.find((p) => p.id === id).sizes[0],
    });
  save();
  renderCart();
  updateCounts();
  openCart();
}

function updateQty(id, delta) {
  const item = state.cart.find((x) => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) state.cart = state.cart.filter((x) => x.id !== id);
  save();
  renderCart();
  updateCounts();
}

function removeItem(id) {
  state.cart = state.cart.filter((x) => x.id !== id);
  save();
  renderCart();
  updateCounts();
}

function renderCart() {
  if (!state.cart.length) {
    $("#cartItems").innerHTML =
      `<div class="empty-state"><h3>Your bag is empty.</h3><p>Add something you love.</p></div>`;
  } else {
    $("#cartItems").innerHTML = state.cart
      .map((item) => {
        const p = products.find((x) => x.id === item.id);
        return `<div class="cart-item">
        <div class="cart-thumb"><img src="${p.image}" alt="${p.name}"></div>
        <div class="cart-info"><h4>${p.name}</h4><p>${money(p.price)}</p>
          <div class="qty"><button data-minus="${p.id}">−</button><span>${item.qty}</span><button data-plus="${p.id}">+</button></div>
        </div>
        <button class="remove" data-remove="${p.id}">Remove</button>
      </div>`;
      })
      .join("");
    document
      .querySelectorAll("[data-minus]")
      .forEach(
        (b) => (b.onclick = () => updateQty(Number(b.dataset.minus), -1)),
      );
    document
      .querySelectorAll("[data-plus]")
      .forEach((b) => (b.onclick = () => updateQty(Number(b.dataset.plus), 1)));
    document
      .querySelectorAll("[data-remove]")
      .forEach((b) => (b.onclick = () => removeItem(Number(b.dataset.remove))));
  }
  const total = state.cart.reduce(
    (sum, i) => sum + (products.find((p) => p.id === i.id)?.price || 0) * i.qty,
    0,
  );
  $("#cartSubtotal").textContent = money(total);
}

function updateCounts() {
  $("#cartCount").textContent = state.cart.reduce((s, i) => s + i.qty, 0);
  $("#wishlistCount").textContent = state.wishlist.length;
}

function toggleWishlist(id) {
  state.wishlist = state.wishlist.includes(id)
    ? state.wishlist.filter((x) => x !== id)
    : [...state.wishlist, id];
  save();
  updateCounts();
  renderProducts();
  renderTrending();
}

function openProduct(id) {
  const p = products.find((x) => x.id === id);
  $("#modalContent").innerHTML = `<div class="modal-product">
    <div class="modal-product-image"><img src="${p.image}" alt="${p.name}"></div>
    <div class="modal-product-copy">
      <p class="eyebrow">${p.category}</p><h2>${p.name}</h2><div class="modal-price">${money(p.price)}</div>
      <p class="modal-description">${p.desc}</p>
      <p class="eyebrow">SELECT SIZE</p>
      <div class="size-row">${p.sizes.map((s, i) => `<button class="size ${i === 0 ? "selected" : ""}" data-size="${s}">${s}</button>`).join("")}</div>
      <button class="btn btn-dark full" id="modalAdd">Add to bag <span>→</span></button>
    </div>
  </div>`;
  $("#productModal").showModal();
  document.querySelectorAll(".size").forEach(
    (b) =>
      (b.onclick = () => {
        document
          .querySelectorAll(".size")
          .forEach((x) => x.classList.remove("selected"));
        b.classList.add("selected");
      }),
  );
  $("#modalAdd").onclick = () => {
    const size = document.querySelector(".size.selected").dataset.size;
    const item = state.cart.find((x) => x.id === id && x.size === size);
    if (item) item.qty++;
    else state.cart.push({ id, qty: 1, size });
    save();
    renderCart();
    updateCounts();
    $("#productModal").close();
    openCart();
  };
}

function openCart() {
  $("#cartDrawer").classList.add("open");
  $("#overlay").classList.add("active");
  document.body.classList.add("lock");
}
function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#overlay").classList.remove("active");
  document.body.classList.remove("lock");
}

function bindUI() {
  $("#searchToggle").onclick = () => {
    $("#searchPanel").classList.add("open");
    $("#globalSearch").focus();
  };
  $("#searchClose").onclick = () => $("#searchPanel").classList.remove("open");
  $("#globalSearch").oninput = (e) => {
    state.query = e.target.value;
    renderProducts();
  };
  $("#sortSelect").onchange = (e) => {
    state.sort = e.target.value;
    renderProducts();
  };
  $("#clearFilters").onclick = () => {
    state.query = "";
    state.category = "All";
    $("#globalSearch").value = "";
    renderFilters();
    renderProducts();
  };
  document
    .querySelectorAll(".cart-trigger")
    .forEach((b) => (b.onclick = openCart));
  $("#cartClose").onclick = closeCart;
  $("#overlay").onclick = closeCart;
  $("#modalClose").onclick = () => $("#productModal").close();
  $("#menuToggle").onclick = () => $("#mobileNav").classList.add("open");
  $("#menuClose").onclick = () => $("#mobileNav").classList.remove("open");
  document
    .querySelectorAll(".mobile-nav a")
    .forEach(
      (a) => (a.onclick = () => $("#mobileNav").classList.remove("open")),
    );
  $("#checkoutBtn").onclick = () => {
    if (!state.cart.length) {
      alert("Your bag is empty.");
      return;
    }
    alert("Demo checkout: your order is ready. No payment was processed.");
  };
  $("#newsletterForm").onsubmit = (e) => {
    e.preventDefault();
    $("#newsletterMessage").textContent = "✓ You're on the list.";
    $("#emailInput").value = "";
  };
}
let currentSlide = 0;
const slides = document.querySelectorAll(".hero-slider .hero");
const slideLabel = document.getElementById("slideLabel");
const totalSlides = slides.length;

function updateSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
  slideLabel.textContent = `0${index + 1} / 0${totalSlides}`;
}

document.getElementById("nextSlide")?.addEventListener("click", () => {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlide(currentSlide);
});

document.getElementById("prevSlide")?.addEventListener("click", () => {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateSlide(currentSlide);
});

// Optional: Auto advance slides every 6 seconds
setInterval(() => {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlide(currentSlide);
}, 6000);
function animatePage() {
  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.to(".page-loader", {
    opacity: 0,
    duration: 0.7,
    delay: 0.45,
    onComplete: () => document.querySelector(".page-loader").remove(),
  });
  gsap.from(".hero-copy>*", {
    y: 45,
    opacity: 0,
    duration: 1,
    stagger: 0.12,
    ease: "power3.out",
    delay: 0.7,
  });
  gsap.from(".hero-orb", {
    scale: 0.8,
    opacity: 0,
    duration: 1.4,
    ease: "power3.out",
    delay: 0.5,
  });
  gsap.utils
    .toArray(".section-head,.story-copy,.collection-card,.newsletter")
    .forEach((el) => {
      gsap.from(el, {
        y: 45,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    });
}
function revealCards() {
  if (!window.gsap) return;
  gsap.from(".product-grid .product-card", {
    y: 25,
    opacity: 0,
    duration: 0.6,
    stagger: 0.05,
    ease: "power2.out",
  });
}
document.addEventListener("DOMContentLoaded", init);
