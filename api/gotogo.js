export default async function handler(req, res) {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send("Thiếu ?url");
  }

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Vercel fetch)",
      },
    });

    // Nếu là HLS .m3u8, trả về URL cuối
    return res.status(200).json({
      finalUrl: response.url,
    });

    // Hoặc trả nội dung:
    // const content = await response.text();
    // res.setHeader("Content-Type", response.headers.get("content-type") || "text/plain");
    // res.setHeader("Access-Control-Allow-Origin", "*");
    // return res.status(200).send(content);

  } catch (err) {
    console.error("Lỗi khi fetch:", err.message);
    return res.status(500).send("Lỗi khi truy cập URL");
  }
}