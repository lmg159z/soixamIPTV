export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) return res.status(400).send("Thiếu ?url");

    // Gửi HEAD request để lấy URL redirect cuối cùng
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow", // follow chain redirect
    });

    // Lấy URL cuối cùng mà nó theo tới
    const finalUrl = response.url;

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ redirect: finalUrl });
  } catch (error) {
    console.error(error);
    res.status(500).send("Không lấy được redirect.");
  }
}