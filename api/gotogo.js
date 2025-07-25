export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing url" });

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow", // Theo dõi redirect tới cùng
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "*/*"
      }
    });

    // Sau khi follow, lấy URL cuối cùng:
    const finalURL = response.url;

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ redirect: finalURL });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}