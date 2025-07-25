// pages/api/proxy.js
export default async function handler(req, res) {
  const target = req.query.url;
  if (!target) return res.status(400).json({ error: "Thiếu URL" });

  try {
    const response = await fetch(target, {
      headers: {
        "User-Agent": "ExoPlayerDemo/2.15.1 (Linux; Android 13)",
        "Referer": target
      }
    });

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");

    const buffer = await response.arrayBuffer();
    res.status(response.status).send(Buffer.from(buffer));
  } catch (error) {
    res.status(403).json({ error: "Fetch lỗi", status: 403 });
  }
}