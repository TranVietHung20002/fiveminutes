// ===== DỮ LIỆU SẢN PHẨM =====
const products = [
  {
    id: 1,
    name: "Hạt Điều Rang Muối",
    description: "Hạt điều rang muối truyền thống, giòn tan, đậm vị.",
    price: 120000,
    weight: "250g",
    image: "img/OIP.jpg",
    badge: "Bán chạy",
    badgeType: "hot",
  },
  {
    id: 2,
    name: "Hạt Điều Mật Ong",
    description: "Phủ mật ong nguyên chất, vị ngọt thanh tự nhiên.",
    price: 145000,
    weight: "250g",
    image: "img/OIP (1).jpg",
    badge: "Mới",
    badgeType: "new",
  },
  {
    id: 3,
    name: "Hạt Điều Sấy Khô",
    description: "Sấy khô tự nhiên, giữ nguyên dinh dưỡng và hương vị.",
    price: 110000,
    weight: "250g",
    image: "img/OIP.jpg",
    badge: null,
    badgeType: null,
  },
  {
    id: 4,
    name: "Hạt Điều Tỏi Ớt",
    description: "Cay nồng hấp dẫn, thích hợp cho người thích vị đậm.",
    price: 135000,
    weight: "250g",
    image: "img/OIP (1).jpg",
    badge: null,
    badgeType: null,
  },
  {
    id: 5,
    name: "Hạt Điều Phô Mai",
    description: "Áo phô mai béo ngậy, tan ngay trong miệng.",
    price: 155000,
    weight: "250g",
    image: "img/OIP.jpg",
    badge: "Mới",
    badgeType: "new",
  },
  {
    id: 6,
    name: "Hạt Điều Wasabi",
    description: "Vị wasabi cay nồng đặc trưng, kích thích vị giác.",
    price: 148000,
    weight: "250g",
    image: "img/OIP (1).jpg",
    badge: null,
    badgeType: null,
  },
  {
    id: 7,
    name: "Hạt Điều Socola",
    description: "Bọc socola đen đắng, kết hợp hoàn hảo giữa ngọt và béo.",
    price: 165000,
    weight: "200g",
    image: "img/OIP.jpg",
    badge: "Mới",
    badgeType: "new",
  },
  {
    id: 8,
    name: "Hạt Điều Muối Biển",
    description: "Rang với muối biển tinh khiết, vị nhẹ thanh, ít mặn hơn.",
    price: 125000,
    weight: "250g",
    image: "img/OIP (1).jpg",
    badge: null,
    badgeType: null,
  },
  {
    id: 9,
    name: "Combo Mix Hạt",
    description: "Hạt điều kết hợp hạnh nhân, óc chó và macadamia.",
    price: 220000,
    weight: "300g",
    image: "img/OIP.jpg",
    badge: "Hot deal",
    badgeType: "hot",
  },
];

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

// =============================================================
// BƯỚC 4: CẤU TRÚC GIỎ HÀNG
// =============================================================

// Mảng chứa các sản phẩm người dùng đã chọn.
// Mỗi phần tử có dạng: { id, name, price, quantity }
let cart = [];

// Tìm sản phẩm trong mảng products theo id
function findProduct(productId) {
  return products.find((p) => p.id === productId);
}

// Tìm dòng sản phẩm đang có trong giỏ theo id
function findCartItem(productId) {
  return cart.find((item) => item.id === productId);
}

// Thêm sản phẩm vào giỏ (hoặc tăng số lượng nếu đã có)
function addToCart(productId) {
  const product  = findProduct(productId);
  if (!product) return;

  const existing = findCartItem(productId);

  if (existing) {
    // Sản phẩm đã có → tăng số lượng
    existing.quantity++;
  } else {
    // Sản phẩm chưa có → thêm mới với quantity = 1
    cart.push({
      id:       product.id,
      name:     product.name,
      price:    product.price,
      quantity: 1,
    });
  }

  saveCart();      // Bước 6: lưu ngay vào localStorage
  updateCartUI();  // Bước 5: vẽ lại giao diện giỏ hàng
}

// Giảm số lượng; xóa hẳn nếu quantity về 0
function decreaseQty(productId) {
  const item = findCartItem(productId);
  if (!item) return;

  item.quantity--;
  if (item.quantity <= 0) {
    cart = cart.filter((i) => i.id !== productId);
  }

  saveCart();
  updateCartUI();
}

// Xóa một sản phẩm khỏi giỏ
function removeFromCart(productId) {
  cart = cart.filter((i) => i.id !== productId);
  saveCart();
  updateCartUI();
}

// =============================================================
// BƯỚC 5: CẬP NHẬT GIAO DIỆN GIỎ HÀNG
// =============================================================

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

  // --- Tính tổng tiền (reduce cộng dồn giá × số lượng) ---
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotalEl.textContent = formatPrice(total);
  cartSummary.style.display = "flex";
}

// =============================================================
// BƯỚC 6: LƯU / KHÔI PHỤC GIỎ HÀNG QUA localStorage
// =============================================================

function saveCart() {
  // Chuyển mảng thành chuỗi JSON rồi lưu
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
  const saved = localStorage.getItem("cart");
  if (saved) {
    // Chuyển chuỗi JSON trở lại thành mảng
    cart = JSON.parse(saved);
  }
}

// =============================================================
// RESPONSIVE UI: HAMBURGER NAV + CART DRAWER
// =============================================================

const navToggleBtn  = document.getElementById("nav-toggle-btn");
const mainNav       = document.getElementById("main-nav");
const cartEl        = document.getElementById("cart");
const cartCloseBtn  = document.getElementById("cart-close-btn");
const overlayEl     = document.getElementById("overlay");

// Kiểm tra đang ở màn hình mobile (< 768px)
function isMobile() {
  return window.innerWidth < 768;
}

// Mở / đóng mobile nav
function toggleNav() {
  const isOpen = mainNav.classList.toggle("open");
  navToggleBtn.classList.toggle("open", isOpen);
  // Chỉ dùng overlay khi nav mở (không trùng với cart drawer)
  if (!cartEl.classList.contains("cart-open")) {
    overlayEl.classList.toggle("active", isOpen);
  }
}

function closeNav() {
  mainNav.classList.remove("open");
  navToggleBtn.classList.remove("open");
  if (!cartEl.classList.contains("cart-open")) {
    overlayEl.classList.remove("active");
  }
}

// Mở / đóng cart drawer (mobile) hoặc scroll đến sidebar (desktop)
function toggleCart() {
  if (isMobile()) {
    const isOpen = cartEl.classList.toggle("cart-open");
    overlayEl.classList.toggle("active", isOpen);
    closeNav(); // đóng nav nếu đang mở
  } else {
    cartEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function closeCart() {
  cartEl.classList.remove("cart-open");
  overlayEl.classList.remove("active");
}

// Đóng tất cả khi nhấn overlay
function closeAll() {
  closeNav();
  closeCart();
}

navToggleBtn.addEventListener("click", toggleNav);
document.getElementById("cart-toggle-btn").addEventListener("click", toggleCart);
cartCloseBtn.addEventListener("click", closeCart);
overlayEl.addEventListener("click", closeAll);

// Phím Escape đóng tất cả
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAll();
});

// Khi resize từ mobile → desktop: dọn dẹp class tránh UI bị kẹt
window.addEventListener("resize", () => {
  if (!isMobile()) {
    closeAll();
    mainNav.classList.remove("open");
    navToggleBtn.classList.remove("open");
  }
});

// =============================================================
// SỰ KIỆN
// =============================================================

// --- Nút "Thêm vào giỏ" (event delegation trên #product-grid) ---
document.getElementById("product-grid").addEventListener("click", (e) => {
  if (!e.target.classList.contains("btn-add")) return;

  const id  = Number(e.target.dataset.id);
  addToCart(id);

  // Hiệu ứng phản hồi tức thì
  e.target.textContent = "✓ Đã thêm!";
  e.target.disabled    = true;
  setTimeout(() => {
    e.target.textContent = "+ Thêm vào giỏ";
    e.target.disabled    = false;
  }, 1000);
});

// --- Nút tăng / giảm / xóa trong giỏ (event delegation trên #cart-items) ---
document.getElementById("cart-items").addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  if (e.target.classList.contains("btn-plus")) {
    addToCart(id);
  } else if (e.target.classList.contains("btn-minus")) {
    decreaseQty(id);
  } else if (e.target.classList.contains("btn-remove")) {
    removeFromCart(id);
  }
});

// --- Nút "Xóa tất cả" ---
document.getElementById("btn-clear").addEventListener("click", () => {
  if (!confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) return;
  cart = [];
  saveCart();
  updateCartUI();
});

// --- Nút "Thanh toán" ---
document.querySelector(".btn-checkout").addEventListener("click", () => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  alert(`Đặt hàng thành công!\nTổng thanh toán: ${formatPrice(total)}\n\nCảm ơn bạn đã mua hàng! 🌰`);
  cart = [];
  saveCart();
  updateCartUI();
});

// =============================================================
// KHỞI CHẠY
// =============================================================
loadCart();        // Bước 6: khôi phục giỏ hàng từ lần truy cập trước
renderProducts();  // Bước 3: vẽ danh sách sản phẩm
updateCartUI();    // Bước 5: hiển thị giỏ hàng đã lưu (nếu có)
