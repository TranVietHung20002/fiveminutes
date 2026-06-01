// ===== DỮ LIỆU SẢN PHẨM =====
const products = [
  { id:1, sku:"HDV-001", name:"Hạt Điều Rang Muối",  description:"Hạt điều rang muối truyền thống, giòn tan, đậm vị.",          price:120000, weight:"250g", stock:50, image:"img/OIP.jpg",     badge:"Bán chạy", badgeType:"hot" },
  { id:2, sku:"HDV-002", name:"Hạt Điều Mật Ong",    description:"Phủ mật ong nguyên chất, vị ngọt thanh tự nhiên.",             price:145000, weight:"250g", stock:30, image:"img/OIP (1).jpg", badge:"Mới",      badgeType:"new" },
  { id:3, sku:"HDV-003", name:"Hạt Điều Sấy Khô",   description:"Sấy khô tự nhiên, giữ nguyên dinh dưỡng và hương vị.",         price:110000, weight:"250g", stock:40, image:"img/OIP.jpg",     badge:null,       badgeType:null  },
  { id:4, sku:"HDV-004", name:"Hạt Điều Tỏi Ớt",    description:"Cay nồng hấp dẫn, thích hợp cho người thích vị đậm.",          price:135000, weight:"250g", stock:25, image:"img/OIP (1).jpg", badge:null,       badgeType:null  },
  { id:5, sku:"HDV-005", name:"Hạt Điều Phô Mai",    description:"Áo phô mai béo ngậy, tan ngay trong miệng.",                   price:155000, weight:"250g", stock:20, image:"img/OIP.jpg",     badge:"Mới",      badgeType:"new" },
  { id:6, sku:"HDV-006", name:"Hạt Điều Wasabi",     description:"Vị wasabi cay nồng đặc trưng, kích thích vị giác.",            price:148000, weight:"250g", stock:15, image:"img/OIP (1).jpg", badge:null,       badgeType:null  },
  { id:7, sku:"HDV-007", name:"Hạt Điều Socola",     description:"Bọc socola đen đắng, kết hợp hoàn hảo giữa ngọt và béo.",     price:165000, weight:"200g", stock:18, image:"img/OIP.jpg",     badge:"Mới",      badgeType:"new" },
  { id:8, sku:"HDV-008", name:"Hạt Điều Muối Biển",  description:"Rang với muối biển tinh khiết, vị nhẹ thanh, ít mặn hơn.",    price:125000, weight:"250g", stock:35, image:"img/OIP (1).jpg", badge:null,       badgeType:null  },
  { id:9, sku:"HDV-009", name:"Combo Mix Hạt",        description:"Hạt điều kết hợp hạnh nhân, óc chó và macadamia.",            price:220000, weight:"300g", stock:10, image:"img/OIP.jpg",     badge:"Hot deal", badgeType:"hot" },
];

// Nếu admin đã lưu chỉnh sửa → dùng dữ liệu đó, không dùng hardcode
(function loadAdminProducts() {
  const saved = localStorage.getItem("adminProducts");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length) {
        products.length = 0;
        parsed.forEach(p => products.push(p));
      }
    } catch { /* bỏ qua nếu JSON lỗi */ }
  }
})();

// ===== TIỆN ÍCH =====
// Định dạng số thành tiền Việt: 120000 → "120.000₫"
function formatPrice(amount) {
  return amount.toLocaleString("vi-VN") + "₫";
}

// ===== RENDER SẢN PHẨM =====
// Duyệt qua mảng products, tạo từng card bằng DOM API rồi gắn vào #product-grid
function renderProducts() {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = ""; // xóa nội dung cũ trước khi vẽ lại

  products.forEach((product) => {

    // --- 1. THẺ BAO NGOÀI ---
    const card = document.createElement("div");
    card.className = "product-card";

    // --- 2. NHÃN GÓC (chỉ tạo nếu sản phẩm có badge) ---
    if (product.badge) {
      const badge = document.createElement("div");
      badge.className = `product-badge ${product.badgeType}`;
      badge.textContent = product.badge;
      card.appendChild(badge);
    }

    // --- 3. ẢNH SẢN PHẨM ---
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    card.appendChild(img);

    // --- 4. KHU VỰC THÔNG TIN ---
    const info = document.createElement("div");
    info.className = "product-info";

    // Tên sản phẩm
    const title = document.createElement("h3");
    title.textContent = product.name;
    info.appendChild(title);

    // Mô tả
    const desc = document.createElement("p");
    desc.className = "product-desc";
    desc.textContent = product.description;
    info.appendChild(desc);

    // Dòng meta: số lượng tồn + nhãn ship
    const meta = document.createElement("div");
    meta.className = "product-meta";

    const stockEl = document.createElement("span");
    stockEl.className = "product-stock";
    stockEl.textContent = `Còn: ${product.stock ?? "—"}`;
    meta.appendChild(stockEl);

    const shipEl = document.createElement("span");
    shipEl.className = "product-ship";
    shipEl.innerHTML = `🚚 <span>Mua 2+ free ship</span>`;
    meta.appendChild(shipEl);

    info.appendChild(meta);

    // --- 5. FOOTER (giá + nút) ---
    const footer = document.createElement("div");
    footer.className = "product-footer";

    // Giá tiền
    const priceSpan = document.createElement("span");
    priceSpan.className = "price";
    priceSpan.innerHTML = `${formatPrice(product.price)}<small>/${product.weight}</small>`;
    footer.appendChild(priceSpan);

    // Nút "Thêm vào giỏ"
    const btn = document.createElement("button");
    btn.className = "btn-add";
    btn.textContent = "+ Thêm vào giỏ";
    btn.dataset.id    = product.id;
    btn.dataset.name  = product.name;
    btn.dataset.price = product.price;
    footer.appendChild(btn);

    info.appendChild(footer);
    card.appendChild(info);

    // --- 6. GẮN CARD VÀO LƯỚI ---
    grid.appendChild(card);
  });
}

// ===== GIỎ HÀNG =====

let cart = [];

function findProduct(productId)  { return products.find((p) => p.id === productId); }
function findCartItem(productId) { return cart.find((item) => item.id === productId); }

function addToCart(productId) {
  const product  = findProduct(productId);
  if (!product) return;

  const existing = findCartItem(productId);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id: product.id, sku: product.sku, name: product.name, price: product.price, quantity: 1 });
  }

  bumpCartBadge();
  saveCart();
  updateCartUI();
}

function decreaseQty(productId) {
  const item = findCartItem(productId);
  if (!item) return;
  item.quantity--;
  if (item.quantity <= 0) cart = cart.filter((i) => i.id !== productId);
  saveCart();
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter((i) => i.id !== productId);
  saveCart();
  updateCartUI();
}

function updateCartUI() {
  const cartItemsEl  = document.getElementById("cart-items");
  const cartSummary  = document.getElementById("cart-summary");
  const cartTotalEl  = document.getElementById("cart-total");
  const cartCountEl  = document.getElementById("cart-count");

  // --- Badge số lượng trên nút header ---
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = totalQty;

  // --- Xóa nội dung cũ ---
  cartItemsEl.innerHTML = "";

  // --- Giỏ trống ---
  if (cart.length === 0) {
    const empty = document.createElement("p");
    empty.className = "cart-empty";
    empty.textContent = "Giỏ hàng của bạn đang trống.";
    cartItemsEl.appendChild(empty);
    cartSummary.style.display = "none";
    return;
  }

  // --- Vẽ từng dòng sản phẩm ---
  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className   = "cart-item";
    row.dataset.id  = item.id;

    // Tên
    const name = document.createElement("span");
    name.className   = "cart-item-name";
    name.textContent = item.name;

    // Nhóm nút tăng / giảm số lượng
    const qtyBox = document.createElement("div");
    qtyBox.className = "cart-item-qty";

    const btnMinus = document.createElement("button");
    btnMinus.className   = "qty-btn btn-minus";
    btnMinus.textContent = "−";
    btnMinus.dataset.id  = item.id;
    btnMinus.title       = "Giảm";

    const qtyNum = document.createElement("span");
    qtyNum.className   = "qty-num";
    qtyNum.textContent = item.quantity;

    const btnPlus = document.createElement("button");
    btnPlus.className   = "qty-btn btn-plus";
    btnPlus.textContent = "+";
    btnPlus.dataset.id  = item.id;
    btnPlus.title       = "Tăng";

    qtyBox.appendChild(btnMinus);
    qtyBox.appendChild(qtyNum);
    qtyBox.appendChild(btnPlus);

    // Thành tiền = giá × số lượng
    const priceEl = document.createElement("span");
    priceEl.className   = "cart-item-price";
    priceEl.textContent = formatPrice(item.price * item.quantity);

    // Nút xóa hàng khỏi giỏ
    const btnRemove = document.createElement("button");
    btnRemove.className   = "qty-btn btn-remove";
    btnRemove.textContent = "×";
    btnRemove.dataset.id  = item.id;
    btnRemove.title       = "Xóa sản phẩm";

    row.appendChild(name);
    row.appendChild(qtyBox);
    row.appendChild(priceEl);
    row.appendChild(btnRemove);
    cartItemsEl.appendChild(row);
  });

  // --- Tính tổng tiền + phí ship ---
  const subtotal  = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQtyAll = cart.reduce((sum, item) => sum + item.quantity, 0);
  const shipFee   = totalQtyAll >= 2 ? 0 : 30000;

  // Hiển thị dòng phí ship
  let shipRow = document.getElementById("cart-ship-row");
  if (!shipRow) {
    shipRow = document.createElement("div");
    shipRow.id = "cart-ship-row";
    shipRow.className = "cart-ship-row";
    cartSummary.insertBefore(shipRow, cartSummary.firstChild);
  }
  shipRow.innerHTML = shipFee === 0
    ? `🚚 Phí ship: <strong class="ship-free">Miễn phí</strong>`
    : `🚚 Phí ship: <strong class="ship-fee">${formatPrice(shipFee)}</strong> <small>(mua 2+ miễn phí)</small>`;

  cartTotalEl.textContent = formatPrice(subtotal + shipFee);
  cartSummary.style.display = "flex";
}

// ===== localStorage =====

function saveCart() { localStorage.setItem("cart", JSON.stringify(cart)); }
function loadCart() {
  const saved = localStorage.getItem("cart");
  if (saved) cart = JSON.parse(saved);
}

// ===== RESPONSIVE: HAMBURGER NAV + CART DRAWER =====

const navToggleBtn = document.getElementById("nav-toggle-btn");
const mainNav      = document.getElementById("main-nav");
const cartEl       = document.getElementById("cart");
const cartCloseBtn = document.getElementById("cart-close-btn");
const overlayEl    = document.getElementById("overlay");

function isMobile() { return window.innerWidth < 768; }

function toggleNav() {
  const isOpen = mainNav.classList.toggle("open");
  navToggleBtn.classList.toggle("open", isOpen);
  if (!cartEl.classList.contains("cart-open")) overlayEl.classList.toggle("active", isOpen);
}

function closeNav() {
  mainNav.classList.remove("open");
  navToggleBtn.classList.remove("open");
  if (!cartEl.classList.contains("cart-open")) overlayEl.classList.remove("active");
}

function toggleCart() {
  if (isMobile()) {
    const isOpen = cartEl.classList.toggle("cart-open");
    overlayEl.classList.toggle("active", isOpen);
    closeNav();
  } else {
    cartEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function closeCart() {
  cartEl.classList.remove("cart-open");
  overlayEl.classList.remove("active");
}

function closeAll() { closeNav(); closeCart(); }

navToggleBtn.addEventListener("click", toggleNav);
document.getElementById("cart-toggle-btn").addEventListener("click", toggleCart);
cartCloseBtn.addEventListener("click", closeCart);
overlayEl.addEventListener("click", closeAll);

window.addEventListener("resize", () => {
  if (!isMobile()) { closeAll(); mainNav.classList.remove("open"); navToggleBtn.classList.remove("open"); }
});

// ===== SỰ KIỆN GIỎ HÀNG =====

document.getElementById("product-grid").addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-add");
  if (!btn) return;

  // Ripple effect
  const ripple = document.createElement("span");
  ripple.className = "ripple-effect";
  const rect = btn.getBoundingClientRect();
  ripple.style.left = `${e.clientX - rect.left - 9}px`;
  ripple.style.top  = `${e.clientY - rect.top  - 9}px`;
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 550);

  addToCart(Number(btn.dataset.id));
  btn.textContent = "✓ Đã thêm!";
  btn.disabled    = true;
  setTimeout(() => { btn.textContent = "+ Thêm vào giỏ"; btn.disabled = false; }, 1000);
});

document.getElementById("cart-items").addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);
  if (!id) return;
  if      (e.target.classList.contains("btn-plus"))   addToCart(id);
  else if (e.target.classList.contains("btn-minus"))  decreaseQty(id);
  else if (e.target.classList.contains("btn-remove")) removeFromCart(id);
});

document.getElementById("btn-clear").addEventListener("click", () => {
  if (!confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) return;
  cart = []; saveCart(); updateCartUI();
});

// ===== MODAL THANH TOÁN =====

const checkoutModal = document.getElementById("checkout-modal");
const successModal  = document.getElementById("success-modal");
const checkoutForm  = document.getElementById("checkout-form");

function calcShip() {
  const qty = cart.reduce((s, i) => s + i.quantity, 0);
  return qty >= 2 ? 0 : 30000;
}

function openCheckoutModal() {
  if (cart.length === 0) return;

  const rows = cart.map((item) => `
    <tr>
      <td class="col-name">${item.name}</td>
      <td class="col-price">${formatPrice(item.price)}</td>
      <td class="col-qty">${item.quantity}</td>
      <td class="col-sub">${formatPrice(item.price * item.quantity)}</td>
    </tr>`).join("");

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const ship     = calcShip();

  document.getElementById("modal-item-list").innerHTML = `
    <table class="order-table">
      <thead><tr><th>Tên sản phẩm</th><th>Đơn giá</th><th>SL</th><th>Thành tiền</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr class="tfoot-ship">
          <td colspan="3">🚚 Phí vận chuyển</td>
          <td class="col-sub">${ship === 0 ? '<span class="ship-free">Miễn phí</span>' : formatPrice(ship)}</td>
        </tr>
      </tfoot>
    </table>`;

  document.getElementById("modal-grand-total").textContent = formatPrice(subtotal + ship);

  checkoutModal.classList.add("active");
  document.body.style.overflow = "hidden";
  document.getElementById("field-name").focus();
}

function closeCheckoutModal() { checkoutModal.classList.remove("active"); document.body.style.overflow = ""; }

function openSuccessModal(name, total) {
  document.getElementById("success-message").textContent =
    `Cảm ơn ${name}! Đơn hàng ${formatPrice(total)} đã được ghi nhận.`;
  successModal.classList.add("active");
}

function closeSuccessModal() { successModal.classList.remove("active"); document.body.style.overflow = ""; }

function validateField(el) { const ok = el.value.trim() !== ""; el.classList.toggle("error", !ok); return ok; }

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const nameEl    = document.getElementById("field-name");
  const phoneEl   = document.getElementById("field-phone");
  const addressEl = document.getElementById("field-address");
  if (![nameEl, phoneEl, addressEl].map(validateField).every(Boolean)) return;

  const order = {
    id: `HD${Date.now()}`, createdAt: new Date().toISOString(),
    customer: { name: nameEl.value.trim(), phone: phoneEl.value.trim(),
                address: addressEl.value.trim(), note: document.getElementById("field-note").value.trim() },
    items: cart.map((i) => ({ id: i.id, sku: i.sku, name: i.name, unitPrice: i.price, quantity: i.quantity, subtotal: i.price * i.quantity })),
    subtotal: cart.reduce((s, i) => s + i.price * i.quantity, 0),
    shipFee:  calcShip(),
    total:    cart.reduce((s, i) => s + i.price * i.quantity, 0) + calcShip(),
    status:   "pending",
  };

  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.setItem("lastOrder", JSON.stringify(order));

  // Vercel → /api/send-email | Local file → localhost:3001/send-email
  const emailApi = window.location.protocol === "file:"
    ? "http://localhost:3001/send-email"
    : "/api/send-email";

  fetch(emailApi, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(order),
  })
    .then((r) => r.json())
    .catch(() => {});

  cart = []; saveCart(); updateCartUI();
  closeCheckoutModal(); checkoutForm.reset();
  openSuccessModal(order.customer.name, order.total);
});

document.querySelector(".btn-checkout").addEventListener("click", openCheckoutModal);
document.getElementById("modal-close-btn").addEventListener("click", closeCheckoutModal);
document.getElementById("success-close-btn").addEventListener("click", closeSuccessModal);
checkoutModal.addEventListener("click", (e) => { if (e.target === checkoutModal) closeCheckoutModal(); });
successModal.addEventListener("click",  (e) => { if (e.target === successModal)  closeSuccessModal();  });

// Escape đóng tất cả overlay, nav, modal một chỗ duy nhất
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  closeAll(); closeCheckoutModal(); closeSuccessModal();
});

// ===== ANIMATIONS =====

function bumpCartBadge() {
  const badge = document.getElementById("cart-count");
  badge.classList.remove("bump");
  void badge.offsetWidth; // reflow để restart animation
  badge.classList.add("bump");
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".section-title").forEach((el) => observer.observe(el));

  // Stagger cards: mỗi card delay thêm 70ms
  document.querySelectorAll(".product-card").forEach((card, i) => {
    card.style.transitionDelay = `${i * 70}ms`;
    observer.observe(card);
  });
}

// ===== KHỞI CHẠY =====

loadCart();
renderProducts();
updateCartUI();
initScrollAnimations();
