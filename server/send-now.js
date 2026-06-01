import { Resend } from "resend";

const resend = new Resend("re_MqFohr7a_2mgrcwtJHBzwGYvAsvkwct5d");

const order = {
  id:       "HD1780316316934",
  customer: { name: "11", phone: "11", address: "11" },
  items:    [{ name: "Hạt Điều Sấy Khô", quantity: 1, subtotal: 110000 }],
  total:    110000,
};

const fmt = (n) => Number(n).toLocaleString("vi-VN") + "₫";

const itemRows = order.items.map((i) => `
  <tr>
    <td style="padding:8px 12px;border-bottom:1px solid #f0e0c8">${i.name}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #f0e0c8;text-align:center">${i.quantity}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #f0e0c8;text-align:right;color:#e07b39;font-weight:700">${fmt(i.subtotal)}</td>
  </tr>`).join("");

const html = `<!DOCTYPE html>
<html lang="vi"><body style="font-family:'Segoe UI',Arial,sans-serif;background:#fdf6ec;margin:0;padding:20px">
<div style="max-width:540px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1)">
  <div style="background:linear-gradient(135deg,#4a2c0a,#7b4a1e);padding:22px 28px;color:#fff">
    <h1 style="margin:0;font-size:1.3rem">🌰 Hạt Điều Vàng</h1>
    <p style="margin:5px 0 0;opacity:.8;font-size:.85rem">Đơn hàng mới · ${order.id}</p>
  </div>
  <div style="padding:20px 28px;border-bottom:2px solid #f0e0c8">
    <table style="width:100%;font-size:.9rem;color:#2d1a07">
      <tr><td style="padding:4px 0;width:120px;color:#5c3d1e">Họ tên:</td><td><strong>${order.customer.name}</strong></td></tr>
      <tr><td style="padding:4px 0;color:#5c3d1e">Điện thoại:</td><td>${order.customer.phone}</td></tr>
      <tr><td style="padding:4px 0;color:#5c3d1e">Địa chỉ:</td><td>${order.customer.address}</td></tr>
    </table>
  </div>
  <div style="padding:20px 28px">
    <table style="width:100%;border-collapse:collapse;font-size:.9rem">
      <thead><tr style="background:#f0e0c8;color:#4a2c0a">
        <th style="padding:8px 12px;text-align:left">Sản phẩm</th>
        <th style="padding:8px 12px;text-align:center">SL</th>
        <th style="padding:8px 12px;text-align:right">Thành tiền</th>
      </tr></thead>
      <tbody>${itemRows}</tbody>
    </table>
    <div style="margin-top:12px;padding:12px 14px;background:#fdf6ec;border-radius:8px;display:flex;justify-content:space-between">
      <span style="font-weight:700">Tổng cộng:</span>
      <span style="font-size:1.2rem;font-weight:700;color:#e07b39">${fmt(order.total)}</span>
    </div>
  </div>
  <div style="background:#4a2c0a;padding:12px 28px;text-align:center;color:#f0e0c8;font-size:.8rem">
    Hạt Điều Vàng · 0971 225 845 · hungtran30415@gmail.com
  </div>
</div>
</body></html>`;

const { data, error } = await resend.emails.send({
  from:    "onboarding@resend.dev",
  to:      "hungtran30415@gmail.com",
  subject: `[HĐV] Đơn ${order.id} — ${order.customer.name} · ${fmt(order.total)}`,
  html,
});

if (error) {
  console.error("Lỗi:", error.message);
} else {
  console.log("Gửi thành công! Email ID:", data.id);
}
