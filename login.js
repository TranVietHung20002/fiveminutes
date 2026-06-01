// Tài khoản mặc định (lần đầu chưa có trong localStorage)
const DEFAULT_USER = "admin";
const DEFAULT_PASS = "hatdieu123";

function getCredentials() {
  const stored = localStorage.getItem("adminCredentials");
  if (stored) return JSON.parse(stored);
  return { username: DEFAULT_USER, password: btoa(DEFAULT_PASS) };
}

const form     = document.getElementById("login-form");
const errorEl  = document.getElementById("login-error");
const eyeBtn   = document.getElementById("btn-eye");
const pwInput  = document.getElementById("password");

// Toggle hiện/ẩn mật khẩu
eyeBtn.addEventListener("click", () => {
  const show = pwInput.type === "password";
  pwInput.type  = show ? "text" : "password";
  eyeBtn.textContent = show ? "🙈" : "👁";
});

// Xử lý đăng nhập
form.addEventListener("submit", (e) => {
  e.preventDefault();
  errorEl.textContent = "";

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const creds    = getCredentials();

  if (username === creds.username && btoa(password) === creds.password) {
    // Lưu session (hết hạn khi đóng tab)
    sessionStorage.setItem("adminLoggedIn", "1");
    window.location.href = "admin.html";
  } else {
    errorEl.textContent = "Tài khoản hoặc mật khẩu không đúng.";
    // Shake animation
    document.getElementById("username").classList.add("shake");
    document.getElementById("password").classList.add("shake");
    setTimeout(() => {
      document.getElementById("username").classList.remove("shake");
      document.getElementById("password").classList.remove("shake");
    }, 400);
  }
});

// Nếu đã đăng nhập rồi → vào thẳng admin
if (sessionStorage.getItem("adminLoggedIn") === "1") {
  window.location.href = "admin.html";
}
