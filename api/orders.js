import { connectDB, getDB } from "../lib/mongodb.js";

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === "OPTIONS") { res.status(200).end(); return; }

  try {
    const client = await connectDB();
    const col    = getDB(client).collection("orders");

    // GET — lấy tất cả đơn hàng (admin)
    if (req.method === "GET") {
      const orders = await col.find({}, { projection: { _id: 0 } })
                              .sort({ createdAt: -1 }).toArray();
      return res.status(200).json(orders);
    }

    // POST — lưu đơn hàng mới
    if (req.method === "POST") {
      const order = req.body;
      if (!order?.id) {
        return res.status(400).json({ ok: false, error: "Thiếu order.id" });
      }
      await col.insertOne({ ...order, savedAt: new Date().toISOString() });
      return res.status(200).json({ ok: true, orderId: order.id });
    }

    res.status(405).end();
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
