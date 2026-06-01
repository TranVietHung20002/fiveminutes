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
    const col    = getDB(client).collection("products");

    // GET — trả về toàn bộ sản phẩm
    if (req.method === "GET") {
      const products = await col.find({}, { projection: { _id: 0 } })
                                .sort({ id: 1 }).toArray();
      return res.status(200).json(products);
    }

    // POST — admin lưu toàn bộ danh sách
    if (req.method === "POST") {
      const products = req.body;
      if (!Array.isArray(products)) {
        return res.status(400).json({ ok: false, error: "Body phải là array" });
      }
      // Upsert từng sản phẩm theo id
      await Promise.all(
        products.map((p) =>
          col.replaceOne({ id: p.id }, p, { upsert: true })
        )
      );
      return res.status(200).json({ ok: true, count: products.length });
    }

    res.status(405).end();
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
