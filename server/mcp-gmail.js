#!/usr/bin/env node
/**
 * Gmail MCP Server — Hạt Điều Vàng
 * Cho phép Claude gửi email xác nhận đơn hàng qua Gmail.
 *
 * Cài đặt: cd server && npm install
 * Khởi chạy: node mcp-gmail.js  (Claude Code tự chạy qua .mcp.json)
 */

import { Server }               from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import nodemailer from "nodemailer";

// ── Khởi tạo MCP server ──────────────────────────────────────
const server = new Server(
  { name: "gmail-orders", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// ── Danh sách tool mà Claude có thể gọi ─────────────────────
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "send_order_email",
      description:
        "Gửi email xác nhận đơn hàng đến cửa hàng và/hoặc khách hàng qua Gmail.",
      inputSchema: {
        type: "object",
        properties: {
          orderId:      { type: "string",  description: "Mã đơn hàng, VD: HD1234567890" },
          customerName: { type: "string",  description: "Tên khách hàng" },
          customerPhone:{ type: "string",  description: "Số điện thoại" },
          customerEmail:{ type: "string",  description: "Email khách hàng (để gửi CC)" },
          address:      { type: "string",  description: "Địa chỉ giao hàng" },
          note:         { type: "string",  description: "Ghi chú đơn hàng" },
          items:        { type: "string",  description: "JSON array sản phẩm [{name,quantity,subtotal}]" },
          total:        { type: "number",  description: "Tổng tiền (số nguyên VND)" },
        },
        required: ["orderId", "customerName", "customerPhone", "address", "items", "total"],
      },
    },
    {
      name: "get_last_order",
      description: "Lấy thông tin đơn hàng mới nhất từ localStorage để chuẩn bị gửi email.",
      inputSchema: { type: "object", properties: {} },
    },
  ],
}));

// ── Xử lý khi Claude gọi tool ────────────────────────────────
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  // ── Tool: get_last_order ─────────────────────────────────
  if (name === "get_last_order") {
    return {
      content: [{
        type: "text",
        text: [
          "Để lấy đơn hàng mới nhất, mở DevTools của trình duyệt (F12) và chạy:",
          "  JSON.parse(localStorage.getItem('lastOrder'))",
          "Sau đó paste kết quả vào đây để tôi gửi email xác nhận.",
        ].join("\n"),
      }],
    };
  }

  // ── Tool: send_order_email ───────────────────────────────
  if (name === "send_order_email") {
    const {
      orderId, customerName, customerPhone,
      customerEmail, address, note, items, total,
    } = args;

    // Kiểm tra biến môi trường
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    const ownerEmail = process.env.OWNER_EMAIL || gmailUser;

    if (!gmailUser || !gmailPass) {
      return {
        content: [{
          type: "text",
          text: "Lỗi: Thiếu GMAIL_USER hoặc GMAIL_APP_PASSWORD trong .mcp.json. Vui lòng cấu hình lại.",
        }],
        isError: true,
      };
    }

    // Parse danh sách sản phẩm
    let itemsList = [];
    try { itemsList = JSON.parse(items); } catch { itemsList = []; }

    const itemRows = itemsList
      .map(
        (i) =>
          `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid #f0e0c8">${i.name}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f0e0c8;text-align:center">${i.quantity}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f0e0c8;text-align:right;color:#e07b39;font-weight:700">
              ${Number(i.subtotal).toLocaleString("vi-VN")}₫
            </td>
          </tr>`
      )
      .join("");

    const totalFmt = Number(total).toLocaleString("vi-VN") + "₫";

    const html = `
<!DOCTYPE html>
<html lang="vi">
<body style="font-family:'Segoe UI',Arial,sans-serif;background:#fdf6ec;margin:0;padding:20px">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1)">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#4a2c0a,#7b4a1e);padding:24px 32px;color:#fff">
    <h1 style="margin:0;font-size:1.4rem">🌰 Hạt Điều Vàng</h1>
    <p style="margin:6px 0 0;opacity:.85;font-size:.9rem">Đơn hàng mới — ${orderId}</p>
  </div>

  <!-- Thông tin khách -->
  <div style="padding:24px 32px;border-bottom:2px solid #f0e0c8">
    <h2 style="margin:0 0 14px;color:#4a2c0a;font-size:1rem">Thông tin khách hàng</h2>
    <table style="width:100%;font-size:.9rem;color:#2d1a07">
      <tr><td style="padding:4px 0;width:140px;color:#5c3d1e">Họ tên:</td><td><strong>${customerName}</strong></td></tr>
      <tr><td style="padding:4px 0;color:#5c3d1e">Điện thoại:</td><td>${customerPhone}</td></tr>
      ${customerEmail ? `<tr><td style="padding:4px 0;color:#5c3d1e">Email:</td><td>${customerEmail}</td></tr>` : ""}
      <tr><td style="padding:4px 0;color:#5c3d1e">Địa chỉ:</td><td>${address}</td></tr>
      ${note ? `<tr><td style="padding:4px 0;color:#5c3d1e;vertical-align:top">Ghi chú:</td><td>${note}</td></tr>` : ""}
    </table>
  </div>

  <!-- Danh sách sản phẩm -->
  <div style="padding:24px 32px">
    <h2 style="margin:0 0 14px;color:#4a2c0a;font-size:1rem">Sản phẩm đặt mua</h2>
    <table style="width:100%;border-collapse:collapse;font-size:.9rem">
      <thead>
        <tr style="background:#f0e0c8;color:#4a2c0a">
          <th style="padding:10px 12px;text-align:left">Sản phẩm</th>
          <th style="padding:10px 12px;text-align:center">SL</th>
          <th style="padding:10px 12px;text-align:right">Thành tiền</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <!-- Tổng cộng -->
    <div style="margin-top:16px;padding:14px 16px;background:#fdf6ec;border-radius:8px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-weight:700;color:#2d1a07">Tổng cộng:</span>
      <span style="font-size:1.3rem;font-weight:700;color:#e07b39">${totalFmt}</span>
    </div>
  </div>

  <!-- Footer -->
  <div style="background:#4a2c0a;padding:16px 32px;text-align:center;color:#f0e0c8;font-size:.8rem">
    Hạt Điều Vàng · ĐT: 0971 225 845 · tranviethung@gmail.com
  </div>
</div>
</body>
</html>`;

    // Tạo transporter Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    const mailOptions = {
      from:    `"Hạt Điều Vàng" <${gmailUser}>`,
      to:      ownerEmail,
      cc:      customerEmail || undefined,
      subject: `[HĐV] Đơn hàng ${orderId} — ${customerName}`,
      html,
    };

    await transporter.sendMail(mailOptions);

    return {
      content: [{
        type: "text",
        text: `Email đơn hàng ${orderId} đã gửi thành công đến ${ownerEmail}${customerEmail ? ` (CC: ${customerEmail})` : ""}.`,
      }],
    };
  }

  return { content: [{ type: "text", text: `Tool "${name}" không tồn tại.` }], isError: true };
});

// ── Kết nối qua stdio (Claude Code dùng stdin/stdout) ────────
const transport = new StdioServerTransport();
await server.connect(transport);
