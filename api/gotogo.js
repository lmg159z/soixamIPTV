export default async function handler(req, res) {
  try {
    const target = req.query.url;

    if (!target) {
      return res.status(400).json({ error: "Thiếu URL" });
    }

    const response = await fetch(target, {
      headers: {
        "User-Agent": "ExoPlayerDemo/2.15.1 (Linux; Android 13)",
        "Referer": target
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Fetch lỗi", status: response.status });
    }

    // Lấy nội dung và content-type
    const contentType = response.headers.get("content-type") || "text/plain";
    const body = await response.text();

    res.setHeader("Content-Type", contentType);
    return res.status(200).send(body);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}