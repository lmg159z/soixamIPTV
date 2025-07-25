// pages/api/iptv.ts

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).send("Thiếu ?url");

  try {
    const decodedUrl = decodeURIComponent(url as string);
    const fetchRes = await fetch(decodedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)"
      }
    });

    if (!fetchRes.ok) throw new Error("Không fetch được nội dung");

    const contentType = fetchRes.headers.get("content-type") || "";

    // Nếu là file .m3u8 thì sửa đường dẫn nội bộ
    if (decodedUrl.endsWith(".m3u8") || contentType.includes("application/vnd.apple.mpegurl")) {
      const originalText = await fetchRes.text();
      const base = decodedUrl.split("/").slice(0, -1).join("/");

      const rewritten = originalText.replace(
        /^(?!#)(.+)$/gm,
        (line) => {
          const absUrl = line.startsWith("http") ? line : `${base}/${line}`;
          return `/api/iptv?url=${encodeURIComponent(absUrl)}`;
        }
      );

      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      res.send(rewritten);
    } else {
      // Trả về trực tiếp dữ liệu binary
      const contentType = fetchRes.headers.get("content-type") || "application/octet-stream";
      res.setHeader("Content-Type", contentType);
      const buffer = await fetchRes.arrayBuffer();
      res.send(Buffer.from(buffer));
    }
  } catch (err) {
    res.status(500).send("Lỗi: " + err.message);
  }
}