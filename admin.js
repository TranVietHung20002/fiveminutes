// ===== DỮ LIỆU GỐC (copy từ script.js) =====
const DEFAULT_PRODUCTS = [
  { id:1, sku:"HDV-001", name:"Hạt Điều Rang Muối",  description:"Hạt điều rang muối truyền thống, giòn tan, đậm vị.",          price:120000, weight:"250g", image:"img/OIP.jpg",     badge:"Bán chạy", badgeType:"hot" },
  { id:2, sku:"HDV-002", name:"Hạt Điều Mật Ong",    description:"Phủ mật ong nguyên chất, vị ngọt thanh tự nhiên.",             price:145000, weight:"250g", image:"img/OIP (1).jpg", badge:"Mới",      badgeType:"new" },
  { id:3, sku:"HDV-003", name:"Hạt Điều Sấy Khô",   description:"Sấy khô tự nhiên, giữ nguyên dinh dưỡng và hương vị.",         price:110000, weight:"250g", image:"img/OIP.jpg",     badge:null,       badgeType:null  },
  { id:4, sku:"HDV-004", name:"Hạt Điều Tỏi Ớt",    description:"Cay nồng hấp dẫn, thích hợp cho người thích vị đậm.",          price:135000, weight:"250g", image:"img/OIP (1).jpg", badge:null,       badgeType:null  },
  { id:5, sku:"HDV-005", name:"Hạt Điều Phô Mai",    description:"Áo phô mai béo ngậy, tan ngay trong miệng.",                   price:155000, weight:"250g", image:"img/OIP.jpg",     badge:"Mới",      badgeType:"new" },
  { id:6, sku:"HDV-006", name:"Hạt Điều Wasabi",     description:"Vị wasabi cay nồng đặc trưng, kích thích vị giác.",            price:148000, weight:"250g", image:"img/OIP (1).jpg", badge:null,       badgeType:null  },
  { id:7, sku:"HDV-007", name:"Hạt Điều Socola",     description:"Bọc socola đen đắng, kết hợp hoàn hảo giữa ngọt và béo.",     price:165000, weight:"200g", image:"img/OIP.jpg",     badge:"Mới",      badgeType:"new" },
  { id:8, sku:"HDV-008", name:"Hạt Điều Muối Biển",  description:"Rang với muối biển tinh khiết, vị nhẹ thanh, ít mặn hơn.",    price:125000, weight:"250g", image:"img/OIP (1).jpg", badge:null,       badgeType:null  },
  { id:9, sku:"HDV-009", name:"Combo Mix Hạt",        description:"Hạt điều kết hợp hạnh nhân, óc chó và macadamia.",            price:220000, weight:"300g", image:"img/OIP.jpg",     badge:"Hot deal", badgeType:"hot" },
];

// ===== STATE =====
let products   = [];   // mảng đang làm việc
let nextId     = 10;   // id tự tăng cho sản phẩm mới
let deleteTarget = null;

// ===== TIỆN ÍCH =====
function formatPrice(n) {
  return Number(n).toLocaleString("vi-VN") + "₫";
}

function showToast(msg, type = "success") {
  const t = document.getElementById("admin-toast");
  t.textContent  = msg;
  t.className    = `admin-toast toast-${type} show`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.className = "admin-toast"; }, 2600);
}

function updateCount() {
  document.getElementById("product-count").textContent =
    `${products.length} sản phẩm`;
}

function nextSku() {
  const ids = products.map(p => parseInt(p.sku.split("-")[1]) || 0);
  const max = ids.length ? Math.max(...ids) : 0;
  return `HDV-${String(max + 1).padStart("003".length, "0")}`;
}

// ===== LOAD / SAVE =====
function loadProducts() {
  const saved = localStorage.getItem("adminProducts");
  if (saved) {
    products = JSON.parse(saved);
    nextId   = Math.max(...products.map(p => p.id), 9) + 1;
  } else {
    products = DEFAULT_PRODUCTS.map(p => ({ ...p }));
    nextId   = 10;
  }
}

function saveProducts() {
  // Đọc lại giá trị mới nhất từ tất cả card trước khi lưu
  document.querySelectorAll(".admin-card").forEach(card => syncCardToState(card));
  localStorage.setItem("adminProducts", JSON.stringify(products));
  // Báo trang chính đọc lại
  localStorage.setItem("productsUpdated", Date.now().toString());
  showToast("✓ Đã lưu — trang web sẽ cập nhật ngay!", "success");
}

// Đọc giá trị từ input trong card → cập nhật vào mảng products
function syncCardToState(card) {
  const id = Number(card.dataset.id);
  const p  = products.find(x => x.id === id);
  if (!p) return;

  p.name        = card.querySelector(".inp-name").value.trim();
  p.description = card.querySelector(".inp-desc").value.trim();
  p.price       = Number(card.querySelector(".inp-price").value) || 0;
  p.weight      = card.querySelector(".inp-weight").value.trim();
  p.image       = card.querySelector(".inp-image").value.trim();

  const badgeVal = card.querySelector(".inp-badge").value;
  if (badgeVal === "hot") { p.badge = "Bán chạy"; p.badgeType = "hot"; }
  else if (badgeVal === "new") { p.badge = "Mới";  p.badgeType = "new"; }
  else if (badgeVal === "deal") { p.badge = "Hot deal"; p.badgeType = "hot"; }
  else { p.badge = null; p.badgeType = null; }
}

// ===== RENDER =====
function badgeValue(p) {
  if (!p.badge) return "none";
  if (p.badgeType === "new") return "new";
  if (p.badge === "Hot deal") return "deal";
  return "hot";
}

function renderCard(product, isNew = false) {
  const card = document.createElement("div");
  card.className  = "admin-card" + (isNew ? " is-new" : "");
  card.dataset.id = product.id;

  const badgeVal  = badgeValue(product);
  const badgeText = product.badge || "";
  const badgeClass = badgeVal === "none" ? "badge-pill none"
                   : badgeVal === "new"  ? "badge-pill new"
                   : "badge-pill";

  card.innerHTML = `
    <!-- Ảnh + toolbar -->
    <div class="card-toolbar">
      ${product.image
        ? `<img class="card-img-preview" src="${product.image}" alt="${product.name}" />`
        : `<div class="card-img-placeholder">🌰</div>`}
      <span class="${badgeClass}" data-badge-display>${badgeText}</span>
      <button class="btn-delete-card" title="Xóa sản phẩm">✕</button>
    </div>

    <!-- Các trường chỉnh sửa -->
    <div class="card-body">

      <div class="field-group">
        <span class="field-label">Tên sản phẩm</span>
        <input class="field-input inp-name" value="${product.name}" placeholder="Tên sản phẩm" />
      </div>

      <div class="field-group">
        <span class="field-label">Mô tả</span>
        <textarea class="field-textarea inp-desc" rows="2">${product.description}</textarea>
      </div>

      <div class="field-row">
        <div class="field-group">
          <span class="field-label">Giá (₫)</span>
          <input class="field-input inp-price" type="number" value="${product.price}" min="0" />
        </div>
        <div class="field-group">
          <span class="field-label">Khối lượng</span>
          <input class="field-input inp-weight" value="${product.weight}" placeholder="250g" />
        </div>
      </div>

      <div class="field-group">
        <span class="field-label">Nhãn (badge)</span>
        <select class="field-select inp-badge">
          <option value="none"  ${badgeVal==="none" ?"selected":""}>— Không có —</option>
          <option value="hot"   ${badgeVal==="hot"  ?"selected":""}>Bán chạy</option>
          <option value="new"   ${badgeVal==="new"  ?"selected":""}>Mới</option>
          <option value="deal"  ${badgeVal==="deal" ?"selected":""}>Hot deal</option>
        </select>
      </div>

      <div class="field-group">
        <span class="field-label">Đường dẫn ảnh</span>
        <div class="img-url-row">
          <input class="field-input inp-image" value="${product.image}" placeholder="img/ten-anh.jpg" />
          <button class="btn-preview-img" type="button">Xem</button>
        </div>
      </div>

    </div>

    <div class="card-footer-info">
      <span>ID: ${product.id}</span>
      <span>${product.sku}</span>
      <span>${formatPrice(product.price)}</span>
    </div>`;

  attachCardListeners(card, product);
  return card;
}

function attachCardListeners(card, product) {
  // Đánh dấu dirty khi thay đổi bất kỳ input nào
  card.querySelectorAll(".field-input, .field-textarea, .field-select").forEach(el => {
    el.addEventListener("input", () => {
      if (!card.classList.contains("is-new")) card.classList.add("is-dirty");
      livePreview(card);
    });
  });

  // Nút xem ảnh
  card.querySelector(".btn-preview-img").addEventListener("click", () => {
    const url = card.querySelector(".inp-image").value.trim();
    const img = card.querySelector(".card-img-preview") ||
                card.querySelector(".card-img-placeholder");
    if (url) {
      if (img.tagName === "DIV") {
        const newImg = document.createElement("img");
        newImg.className = "card-img-preview";
        img.replaceWith(newImg);
        card.querySelector(".card-img-preview").src = url;
      } else {
        img.src = url;
      }
    }
    livePreview(card);
  });

  // Nút xóa card
  card.querySelector(".btn-delete-card").addEventListener("click", () => {
    deleteTarget = product.id;
    document.getElementById("delete-modal-msg").textContent =
      `Xóa "${card.querySelector(".inp-name").value.trim()}"?`;
    document.getElementById("delete-modal").classList.add("active");
  });
}

// Cập nhật preview badge ngay khi chọn
function livePreview(card) {
  const badgeEl  = card.querySelector("[data-badge-display]");
  const badgeVal = card.querySelector(".inp-badge").value;

  if (badgeVal === "none") {
    badgeEl.className = "badge-pill none";
    badgeEl.textContent = "";
  } else if (badgeVal === "new") {
    badgeEl.className = "badge-pill new";
    badgeEl.textContent = "Mới";
  } else if (badgeVal === "deal") {
    badgeEl.className = "badge-pill";
    badgeEl.textContent = "Hot deal";
  } else {
    badgeEl.className = "badge-pill";
    badgeEl.textContent = "Bán chạy";
  }

  // Cập nhật footer price preview
  const price    = Number(card.querySelector(".inp-price").value) || 0;
  const footerEl = card.querySelector(".card-footer-info span:last-child");
  if (footerEl) footerEl.textContent = formatPrice(price);
}

function renderAll() {
  const grid = document.getElementById("admin-grid");
  grid.innerHTML = "";
  products.forEach(p => grid.appendChild(renderCard(p)));
  updateCount();
}

// ===== THÊM SẢN PHẨM MỚI =====
function addProduct() {
  const newProduct = {
    id:          nextId++,
    sku:         nextSku(),
    name:        "Sản phẩm mới",
    description: "Mô tả sản phẩm.",
    price:       100000,
    weight:      "250g",
    image:       "img/OIP.jpg",
    badge:       null,
    badgeType:   null,
  };
  products.push(newProduct);
  const card = renderCard(newProduct, true);
  document.getElementById("admin-grid").prepend(card);
  card.scrollIntoView({ behavior: "smooth", block: "center" });
  card.querySelector(".inp-name").focus();
  card.querySelector(".inp-name").select();
  updateCount();
}

// ===== XÓA SẢN PHẨM =====
function deleteProduct(id) {
  products = products.filter(p => p.id !== id);
  const card = document.querySelector(`.admin-card[data-id="${id}"]`);
  if (card) {
    card.style.transition = "opacity 0.2s, transform 0.2s";
    card.style.opacity    = "0";
    card.style.transform  = "scale(0.95)";
    setTimeout(() => card.remove(), 220);
  }
  updateCount();
  showToast("Đã xóa sản phẩm.", "success");
}

// ===== SỰ KIỆN =====
document.getElementById("btn-add-product").addEventListener("click", addProduct);
document.getElementById("btn-save-all").addEventListener("click", saveProducts);

document.getElementById("delete-confirm").addEventListener("click", () => {
  if (deleteTarget !== null) deleteProduct(deleteTarget);
  deleteTarget = null;
  document.getElementById("delete-modal").classList.remove("active");
});

document.getElementById("delete-cancel").addEventListener("click", () => {
  deleteTarget = null;
  document.getElementById("delete-modal").classList.remove("active");
});

document.getElementById("delete-modal").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) {
    deleteTarget = null;
    e.currentTarget.classList.remove("active");
  }
});

// Ctrl+S lưu nhanh
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    saveProducts();
  }
});

// ===== KHỞI CHẠY =====
loadProducts();
renderAll();
