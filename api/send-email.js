import { Resend } from "resend";

const fmt = (n) => Number(n).toLocaleString("vi-VN") + "₫";

function buildHtml(order) {
  const { id, customer, items, total } = order;

  const rows = items.map((i) => `
    <tr>
      <td style="padding:8px 14px;border-bottom:1px solid #f0e0c8">${i.name}</td>
      <td style="padding:8px 14px;border-bottom:1px solid #f0e0c8;text-align:center">${i.quantity}</td>
      <td style="padding:8px 14px;border-bottom:1px solid #f0e0c8;text-align:right;color:#e07b39;font-weight:700">${fmt(i.subtotal)}</td>
    </tr>`).join("");

  return `<!DOCTYPE html>
<html lang="vi">
<body style="font-family:'Segoe UI',Arial,sans-serif;background:#fdf6ec;margin:0;padding:20px">
<div style="max-width:540px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1)">
  <div style="background:linear-gradient(135deg,#4a2c0a,#7b4a1e);padding:22px 28px;color:#fff">
    <h1 style="margin:0;font-size:1.3rem">🌰 Hạt Điều Vàng</h1>
    <p style="margin:5px 0 0;opacity:.8;font-size:.85rem">Đơn hàng mới · ${id}</p>
  </div>
  <div style="padding:20px 28px;border-bottom:2px solid #f0e0c8">
    <h2 style="margin:0 0 10px;color:#4a2c0a;font-size:.95rem">Thông tin khách hàng</h2>
    <table style="width:100%;font-size:.9rem;color:#2d1a07">
      <tr><td style="padding:4px 0;width:120px;color:#5c3d1e">Họ tên:</td>   <td><strong>${customer.name}</strong></td></tr>
      <tr><td style="padding:4px 0;color:#5c3d1e">Điện thoại:</td>            <td>${customer.phone}</td></tr>
      <tr><td style="padding:4px 0;color:#5c3d1e">Địa chỉ:</td>              <td>${customer.address}</td></tr>
      ${customer.note ? `<tr><td style="padding:4px 0;color:#5c3d1e;vertical-align:top">Ghi chú:</td><td>${customer.note}</td></tr>` : ""}
    </table>
  </div>
  <div style="padding:20px 28px">
    <h2 style="margin:0 0 10px;color:#4a2c0a;font-size:.95rem">Sản phẩm đặt mua</h2>
    <table style="width:100%;border-collapse:collapse;font-size:.9rem">
      <thead>
        <tr style="background:#f0e0c8;color:#4a2c0a">
          <th style="padding:8px 14px;text-align:left">Tên</th>
          <th style="padding:8px 14px;text-align:center">SL</th>
          <th style="padding:8px 14px;text-align:right">Thành tiền</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="margin-top:14px;padding:12px 16px;background:#fdf6ec;border-radius:8px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-weight:700;color:#2d1a07">Tổng cộng:</span>
      <span style="font-size:1.25rem;font-weight:700;color:#e07b39">${fmt(total)}</span>
    </div>
  </div>
  <div style="background:#4a2c0a;padding:12px 28px;text-align:center;color:#f0e0c8;font-size:.8rem">
    Hạt Điều Vàng · 0971 225 845 · hungtran30415@gmail.com
  </div>
</div>
</body></html>`;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") { res.status(200).end(); return; }
  if (req.method !== "POST")    { res.status(405).end(); return; }

  try {
    const order  = req.body;
    const resend = new Resend(process.env.RESEND_API_KEY);
    const to     = process.env.OWNER_EMAIL || "hungtran30415@gmail.com";

    const { data, error } = await resend.emails.send({
      from:    "onboarding@resend.dev",
      to,
      subject: `[HĐV] ${order.id} — ${order.customer?.name} · ${fmt(order.total)}`,
      html:    buildHtml(order),
    });

    if (error) throw new Error(error.message);

    res.status(200).json({ ok: true, emailId: data.id });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
