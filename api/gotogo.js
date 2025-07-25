export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ error: 'Thiếu hoặc sai URL' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ExoPlayerDemo/2.15.1 (Linux; Android 13)',
        'Referer': getRefererByHost(url),
      },
    });

    // Copy headers hợp lệ
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }

    const data = await response.arrayBuffer();
    res.status(response.status).send(Buffer.from(data));
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi fetch URL: ' + error.message });
  }
}

// Tuỳ chỉnh Referer theo domain
function getRefererByHost(url) {
  const hostname = new URL(url).hostname;
  const map = {
    'xem.truyenhinh.click': 'https://xem.truyenhinh.click',
    'some-site.com': 'https://some-site.com',
  };
  return map[hostname] || `https://${hostname}`;
}