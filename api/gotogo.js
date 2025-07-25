export default async function handler(req, res) {
  const target = req.query.url;

  if (!target) {
    return res.status(400).json({ error: "Missing `url` parameter" });
  }

  try {
    const response = await fetch(target, {
      method: "GET",
      redirect: "manual", // Không follow redirect để bắt Location
    });

    const location = response.headers.get("location");

    if (response.status >= 300 && response.status < 400 && location) {
      return res.setHeader("Access-Control-Allow-Origin", "*").status(200).json({
        original: target,
        redirected: location,
      });
    } else {
      return res.setHeader("Access-Control-Allow-Origin", "*").status(400).json({
        error: "Not a redirect or no Location header",
        status: response.status,
      });
    }
  } catch (err) {
    return res.setHeader("Access-Control-Allow-Origin", "*").status(500).json({
      error: err.message,
    });
  }
}