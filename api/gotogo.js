// pages/api/proxy.js

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).send("Missing URL");

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow', // theo redirect
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/octet-stream');
    const stream = response.body;
    stream.pipeTo(Writable.toWeb(res));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}