export default async function handler(req, res) {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send("Thiếu ?url");
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Node.js)",
        "Referer": targetUrl, // tuỳ site
      },
      redirect: "follow",
    });

    const contentType = response.headers.get("content-type") || "text/plain";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Gửi lại toàn bộ response như proxy
    const body = await response.text(); // dùng text() để parse m3u8 hoặc html
    return res.status(200).send(body);

  } catch (err) {
    console.error("Lỗi:", err.message);
    return res.status(500).send("Không truy cập được URL gốc");
  }
}