
// Hàm lấy dữ liệu từ Google Sheets và parse thành JSON
export default async function handler(req, res) {
  try {
    const rows = await getDataFromSheet();
    renderToM3U(rows, res);
  } catch (error) {
    res.status(500).send("Lỗi khi lấy dữ liệu từ Google Sheet");
  }
}

async function getDataFromSheet() {
  const response = await fetch(`https://docs.google.com/spreadsheets/d/1hSEcXxxEkbgq8203f_sTKAi3ZNEnFNoBnr7f3fsfzYE/gviz/tq?gid=0&tqx=out:json`);
  if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
  const text = await response.text();

  const jsonText = text.match(/(?<=setResponse\().*(?=\);)/s)[0];
  const raw = JSON.parse(jsonText);

  const table = raw.table;
  const cols = table.cols.map(col => col.label);
  
  return table.rows.map(row => {
    const obj = {};
    row.c.forEach((cell, i) => {
      obj[cols[i]] = cell ? cell.v : null;
    });
    return obj;
  });
}

function renderToM3U(channels, res) {
  let m3u = "#EXTM3U\n";
  for (const ch of channels) {
    if (!ch.DRM){
    m3u += `#EXTINF:-1 tvg-id="${ch.id}${ch.DRM}" tvg-logo="${ch.logo}" group-title="${ch.group}",${ch.name}\n`;
    m3u += `${ch.streamURL}\n`; // ← lưu ý field phải đúng
  }
  }

  res.setHeader("Content-Type", "audio/x-mpegurl");
  res.setHeader("Content-Disposition", 'inline; filename="playlist.m3u"');
  res.status(200).send(m3u);
}