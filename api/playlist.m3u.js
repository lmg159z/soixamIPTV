export default function handler(req, res) {
  const channels = [
    {
      name: "HTV7",
      id: "htv7",
      logo: "https://example.com/logo/htv7.png",
      url: "https://stream.example.com/htv7.m3u8",
      group: "Việt Nam"
    },
    {
      name: "VTV1 HD",
      id: "vtv1hd",
      logo: "https://example.com/logo/vtv1hd.png",
      url: "https://stream.example.com/vtv1hd.m3u8",
      group: "Quốc gia"
    }
  ];

  let m3u = "#EXTM3U\n";
  for (const ch of channels) {
    m3u += `#EXTINF:-1 tvg-id="${ch.id}" tvg-logo="${ch.logo}" group-title="${ch.group}",${ch.name}\n`;
    m3u += `${ch.url}\n`;
  }

  res.setHeader("Content-Type", "audio/x-mpegurl");
  res.setHeader("Content-Disposition", "inline; filename=\"playlist.m3u\"");
  res.status(200).send(m3u);
}