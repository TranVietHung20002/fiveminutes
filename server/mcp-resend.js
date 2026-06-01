#!/usr/bin/env node
/**
 * Resend MCP Server — Hạt Điều Vàng
 * Gửi email xác nhận đơn hàng qua Resend API.
 */

import { Server }               from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { Resend }               from "resend";

const server = new Server(
  { name: "resend-orders", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// ── Danh sách tool ────────────────────────────────────────────
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "send_order_email",
      description: "Gửi email xác nhận đơn hàng đến chủ shop qua Resend.",
      inputSchema: {
        type: "object",
        properties: {
          orderId:       { type: "string",  description: "Mã đơn hàng, VD: HD1234567890" },
          customerName:  { type: "string",  description: "Tên khách hàng" },
          customerPhone: { type: "string",  description: "Số điện thoại" },
          address:       { type: "string",  description: "Địa chỉ giao hàng" },
          note:          { type: "string",  description: "Ghi chú" },
          items:         { type: "string",  description: "JSON array [{name, quantity, unitPrice, subtotal}]" },
          total:         { type: "number",  description: "Tổng tiền (VND)" },
        },
        required: ["orderId", "customerName", "customerPhone", "address", "items", "total"],
      },
    },
  ],
}));

// ── Xử lý tool call ──────────────────────────────────────────
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "send_order_email") {
    return { content: [{ type: "text", text: `Tool không tồn tại.` }], isError: true };
  }

  const { orderId, customerName, customerPhone, address, note, items, total } =
    request.params.arguments;

  const apiKey     = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.OWNER_EMAIL;

  if (!apiKey) {
    return { content: [{ type: "text", text: "Lỗi: Thiếu RESEND_API_KEY." }], isError: true };
  }

  // Parse sản phẩm
  let itemsList = [];
  try { itemsList = JSON.parse(items); } catch { itemsList = []; }

  const fmt = (n) => Number(n).toLocaleString("vi-VN") + "₫";

  const itemRows = itemsList.map((i) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f0e0c8">${i.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0e0c8;text-align:center">${i.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0e0c8;text-align:right;color:#e07b39;font-weight:700">${fmt(i.subtotal)}</td>
    </tr>`).join("");

  const html = `<!DOCTYPE html>
<html lang="vi">
<body style="font-family:'Segoe UI',Arial,sans-serif;background:#fdf6ec;margin:0;padding:20px">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1)">

  <div style="background:linear-gradient(135deg,#4a2c0a,#7b4a1e);padding:24px 32px;color:#fff">
    <h1 style="margin:0;font-size:1.4rem">🌰 Hạt Điều Vàng</h1>
    <p style="margin:6px 0 0;opacity:.8;font-size:.9rem">Đơn hàng mới · ${orderId}</p>
  </div>

  <div style="padding:24px 32px;border-bottom:2px solid #f0e0c8">
    <h2 style="margin:0 0 12px;color:#4a2c0a;font-size:1rem">Thông tin khách hàng</h2>
    <table style="width:100%;font-size:.9rem;color:#2d1a07">
      <tr><td style="padding:4px 0;width:130px;color:#5c3d1e">Họ tên:</td><td><strong>${customerName}</strong></td></tr>
      <tr><td style="padding:4px 0;color:#5c3d1e">Điện thoại:</td><td>${customerPhone}</td></tr>
      <tr><td style="padding:4px 0;color:#5c3d1e">Địa chỉ:</td><td>${address}</td></tr>
      ${note ? `<tr><td style="padding:4px 0;color:#5c3d1e;vertical-align:top">Ghi chú:</td><td>${note}</td></tr>` : ""}
    </table>
  </div>

  <div style="padding:24px 32px">
    <h2 style="margin:0 0 12px;color:#4a2c0a;font-size:1rem">Sản phẩm đặt mua</h2>
    <table style="width:100%;border-collapse:collapse;font-size:.9rem">
      <thead>
        <tr style="background:#f0e0c8;color:#4a2c0a">
          <th style="padding:9px 12px;text-align:left">Sản phẩm</th>
          <th style="padding:9px 12px;text-align:center">SL</th>
          <th style="padding:9px 12px;text-align:right">Thành tiền</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>
    <div style="margin-top:14px;padding:12px 16px;background:#fdf6ec;border-radius:8px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-weight:700;color:#2d1a07">Tổng cộng:</span>
      <span style="font-size:1.3rem;font-weight:700;color:#e07b39">${fmt(total)}</span>
    </div>
  </div>

  <div style="background:#4a2c0a;padding:14px 32px;text-align:center;color:#f0e0c8;font-size:.8rem">
    Hạt Điều Vàng · ĐT: 0971 225 845 · hungtran30415@gmail.com
  </div>
</div>
</body>
</html>`;

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to:   ownerEmail,
    subject: `[HĐV] Đơn ${orderId} — ${customerName} · ${fmt(total)}`,
    html,
  });

  if (error) {
    return { content: [{ type: "text", text: `Lỗi Resend: ${error.message}` }], isError: true };
  }

  return {
    content: [{ type: "text", text: `Email gửi thành công! ID: ${data.id}\nĐến: ${ownerEmail}` }],
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
