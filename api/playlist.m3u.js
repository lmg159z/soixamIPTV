/*
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
async function checkUrl(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}
function renderToM3U(channels, res) {
  let m3u = "#EXTM3U\n";
  for (const ch of channels) {
    const logoChannel = ch.logo.startsWith("http")?ch.logo:`https://lmg159z.github.io/soixamTV/wordspage/image/logo/${ch.logo}`;

 
  
  if (ch.check !== "check"){
  if (ch.DRM === true) {
   if (ch.typeClearnKey === "base64"){
   m3u += `#EXTINF:-1 tvg-id="channel_${ch.id}" tvg-logo="${logoChannel}" group-title="${ch.group}",${ch.name}\n`;
    m3u += `#EXTVLCOPT:http-user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36\n`;
    m3u += `#KODIPROP:inputstreamaddon=inputstream.adaptive\n`;
    m3u += `#KODIPROP:inputstream.adaptive.manifest_type=dash\n`;
    m3u += `#KODIPROP:inputstream.adaptive.license_type=org.w3.clearkey\n`;
    m3u += `#KODIPROP:inputstream.adaptive.license_key={"keys":[{"kty":"oct","k":"${ch.key}","kid":"${ch.keyID}"}],"type":"temporary"}\n`;
    m3u += `${ch.streamURL}\n`;
    }
   if (ch.typeClearnKey === "hex"){
      m3u += `#EXTVLCOPT:http-user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36\n`;
      m3u += `#KODIPROP:inputstreamaddon=inputstream.adaptive\n`;
      m3u += `#KODIPROP:inputstream.adaptive.manifest_type=dash\n`;
      m3u += `#KODIPROP:inputstream.adaptive.license_type=${ch.license_type}\n`;
      m3u += `#KODIPROP:inputstream.adaptive.license_key=${ch.key}:${ch.keyID}\n`;
      m3u += `#EXTINF:-1 tvg-id="" tvg-logo="${logoChannel}" group-title="${ch.group}",${ch.name}\n`;
      m3u += `${ch.streamURL}\n`;
    }
   if (ch.typeClearnKey === "url"){
     m3u += `#EXTINF:-1 tvg-id="channel_${ch.STT}" tvg-logo="${logoChannel}" group-title="${ch.group}",${ch.name}\n`;
      m3u += `#EXTVLCOPT:http-user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36\n`;
      m3u += `#KODIPROP:inputstreamaddon=inputstream.adaptive\n`;
      m3u += `#KODIPROP:inputstream.adaptive.manifest_type=dash\n`;
      m3u += `#KODIPROP:inputstream.adaptive.license_type=${ch.license_type}\n`;
      m3u += `#KODIPROP:inputstream.adaptive.license_key=${ch.kURL}\n`;
      m3u += `${ch.streamURL}\n`;
      
   }
  } else {
    m3u += `#EXTINF:-1 tvg-id="channel_${ch.id}" tvg-logo="${logoChannel}" group-title="${ch.group}",${ch.name}\n`;
    m3u += `${ch.streamURL}\n`;
  }
  }
  else {
  if (await checkUrl(ch.streamURL)) {
    m3u += `#EXTINF:-1 tvg-id="channel_${ch.id}" tvg-logo="${logoChannel}" group-title="${ch.group}",${ch.name}\n`;
    m3u += `${ch.streamURL}\n`;
  } else {
    console.log(`❌ URL chết: ${ch.name} (${ch.streamURL})`);
  }
}
  
}
  res.setHeader("Content-Type", "audio/x-mpegurl");
  res.setHeader("Content-Disposition", 'inline; filename="playlist.m3u"');
  res.status(200).send(m3u);
}


//yessybdhdbdbd
*/


/*
// Hàm lấy dữ liệu từ Google Sheets và parse thành JSON
export default async function handler(req, res) {
  try {
    const rows = await getDataFromSheet();
    await renderToM3U(rows, res); // <-- gọi async
  } catch (error) {
    console.error(error);
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

async function checkUrl(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

async function renderToM3U(channels, res) {
  let m3u = "#EXTM3U\n";

  for (const ch of channels) {
    const logoChannel = ch.logo?.startsWith("http") 
      ? ch.logo 
      : `https://lmg159z.github.io/soixamTV/wordspage/image/logo/${ch.logo}`;

    if (ch.check !== "check") {
      if (ch.DRM === true) {
        if (ch.typeClearnKey === "base64") {
          m3u += `#EXTINF:-1 tvg-id="channel_${ch.id}" tvg-logo="${logoChannel}" group-title="${ch.group}",${ch.name}\n`;
          m3u += `#EXTVLCOPT:http-user-agent=Mozilla/5.0 ...\n`;
          m3u += `#KODIPROP:inputstreamaddon=inputstream.adaptive\n`;
          m3u += `#KODIPROP:inputstream.adaptive.manifest_type=dash\n`;
          m3u += `#KODIPROP:inputstream.adaptive.license_type=org.w3.clearkey\n`;
          m3u += `#KODIPROP:inputstream.adaptive.license_key={"keys":[{"kty":"oct","k":"${ch.key}","kid":"${ch.keyID}"}],"type":"temporary"}\n`;
          m3u += `${ch.streamURL}\n`;
        }

        if (ch.typeClearnKey === "hex") {
          m3u += `#EXTVLCOPT:http-user-agent=Mozilla/5.0 ...\n`;
          m3u += `#KODIPROP:inputstreamaddon=inputstream.adaptive\n`;
          m3u += `#KODIPROP:inputstream.adaptive.manifest_type=dash\n`;
          m3u += `#KODIPROP:inputstream.adaptive.license_type=${ch.license_type}\n`;
          m3u += `#KODIPROP:inputstream.adaptive.license_key=${ch.key}:${ch.keyID}\n`;
          m3u += `#EXTINF:-1 tvg-id="" tvg-logo="${logoChannel}" group-title="${ch.group}",${ch.name}\n`;
          m3u += `${ch.streamURL}\n`;
        }

        if (ch.typeClearnKey === "url") {
          m3u += `#EXTINF:-1 tvg-id="channel_${ch.STT}" tvg-logo="${logoChannel}" group-title="${ch.group}",${ch.name}\n`;
          m3u += `#EXTVLCOPT:http-user-agent=Mozilla/5.0 ...\n`;
          m3u += `#KODIPROP:inputstreamaddon=inputstream.adaptive\n`;
          m3u += `#KODIPROP:inputstream.adaptive.manifest_type=dash\n`;
          m3u += `#KODIPROP:inputstream.adaptive.license_type=${ch.license_type}\n`;
          m3u += `#KODIPROP:inputstream.adaptive.license_key=${ch.kURL}\n`;
          m3u += `${ch.streamURL}\n`;
        }
      } else {
        m3u += `#EXTINF:-1 tvg-id="channel_${ch.id}" tvg-logo="${logoChannel}" group-title="${ch.group}",${ch.name}\n`;
        m3u += `${ch.streamURL}\n`;
      }
    } else {
      if (await checkUrl(ch.streamURL)) {
        m3u += `#EXTINF:-1 tvg-id="channel_${ch.id}" tvg-logo="${logoChannel}" group-title="${ch.group}",${ch.name}\n`;
        m3u += `${ch.streamURL}\n`;
      } else {
        console.log(`❌ URL chết: ${ch.name} (${ch.streamURL})`);
      }
    }
  }

  res.setHeader("Content-Type", "audio/x-mpegurl");
  res.setHeader("Content-Disposition", 'inline; filename="playlist.m3u"');
  res.status(200).send(m3u);
}
*/

export default async function handler(req, res) {
  try {
    const rows = await getDataFromSheet();
    const m3u = await renderToM3U(rows);
    res.setHeader("Content-Type", "audio/x-mpegurl");
    res.setHeader("Content-Disposition", 'inline; filename="playlist.m3u"');
    res.status(200).send(m3u);
  } catch (error) {
    console.error(error);
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

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', timeout: 3000 });
    return res.ok;
  } catch (error) {
    console.warn(`Failed to check URL ${url}: ${error}`); // Ghi log khi check URL bị lỗi
    return false; // Coi như URL không hoạt động nếu check bị lỗi
  }
}

async function renderToM3U(channels) {
  let m3u = "#EXTM3U\n";

  for (let i = 0; i < channels.length; i++) {
    const ch = channels[i];
    const logoChannel = ch.logo?.startsWith("http")
      ? ch.logo
      : `https://lmg159z.github.io/soixamTV/wordspage/image/logo/${ch.logo}`;

    let isAlive = true;
    if (ch.check === 'check') {
      isAlive = await checkUrl(ch.streamURL);
      if (!isAlive) {
        console.log(`❌ DEAD: ${ch.name}`);
        continue;
      }
    }

    if (ch.DRM === true) {
      if (ch.typeClearnKey === "base64") {
        m3u += `#EXTINF:-1 tvg-id="channel_${ch.id}" tvg-logo="${logoChannel}" group-title="${ch.group}",${ch.name}\n`;
        m3u += `#EXTVLCOPT:http-user-agent=Mozilla/5.0\n`;
        m3u += `#KODIPROP:inputstreamaddon=inputstream.adaptive\n`;
        m3u += `#KODIPROP:inputstream.adaptive.manifest_type=dash\n`;
        m3u += `#KODIPROP:inputstream.adaptive.license_type=org.w3.clearkey\n`;
        m3u += `#KODIPROP:inputstream.adaptive.license_key={"keys":[{"kty":"oct","k":"${ch.key}","kid":"${ch.keyID}"}],"type":"temporary"}\n`;
        m3u += `${ch.streamURL}\n`;
      } else if (ch.typeClearnKey === "hex") {
        m3u += `#EXTVLCOPT:http-user-agent=Mozilla/5.0\n`;
        m3u += `#KODIPROP:inputstreamaddon=inputstream.adaptive\n`;
        m3u += `#KODIPROP:inputstream.adaptive.manifest_type=dash\n`;
        m3u += `#KODIPROP:inputstream.adaptive.license_type=${ch.license_type}\n`;
        m3u += `#KODIPROP:inputstream.adaptive.license_key=${ch.key}:${ch.keyID}\n`;
        m3u += `#EXTINF:-1 tvg-id="" tvg-logo="${logoChannel}" group-title="${ch.group}",${ch.name}\n`;
        m3u += `${ch.streamURL}\n`;
      } else if (ch.typeClearnKey === "url") {
        m3u += `#EXTINF:-1 tvg-id="channel_${ch.STT}" tvg-logo="${logoChannel}" group-title="${ch.group}",${ch.name}\n`;
        m3u += `#EXTVLCOPT:http-user-agent=Mozilla/5.0\n`;
        m3u += `#KODIPROP:inputstreamaddon=inputstream.adaptive\n`;
        m3u += `#KODIPROP:inputstream.adaptive.manifest_type=dash\n`;
        m3u += `#KODIPROP:inputstream.adaptive.license_type=${ch.license_type}\n`;
        m3u += `#KODIPROP:inputstream.adaptive.license_key=${ch.kURL}\n`;
        m3u += `${ch.streamURL}\n`;
      }
    } else {
      m3u += `#EXTINF:-1 tvg-id="channel_${ch.id}" tvg-logo="${logoChannel}" group-title="${ch.group}",${ch.name}\n`;
      m3u += `${ch.streamURL}\n`;
    }
  }

  return m3u;
}