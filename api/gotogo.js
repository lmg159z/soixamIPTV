export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: "Thiếu URL cần redirect" });
  }

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      redirect: "manual"
    });

    const location = response.headers.get("location");

    if (response.status === 301 || response.status === 302) {
      if (!location) {
        return res.status(403).json({ error: "Không có tiêu đề Location", status: response.status });
      }
      return res.json({ redirect: location });
    } else {
      return res.status(403).json({ error: "Không phải redirect", status: response.status });
    }
  } catch (error) {
    return res.status(500).json({ error: "Lỗi máy chủ", detail: error.message });
  }
}