export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: "Thiếu URL cần redirect" });
  }

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      redirect: "manual",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Referer": "https://xem.truyenhinh.click/" // Quan trọng!
      }
    });

    const location = response.headers.get("location");

    if ((response.status === 301 || response.status === 302) && location) {
      return res.json({ redirect: location });
    } else {
      return res.status(403).json({ error: "Không phải redirect", status: response.status });
    }
  } catch (error) {
    return res.status(500).json({ error: "Lỗi máy chủ", detail: error.message });
  }
}