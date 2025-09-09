import chromium from "chrome-aws-lambda";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido, usa POST" });
  }

  try {
    // Parsear body manual
    let body = "";
    await new Promise((resolve) => {
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", resolve);
    });

    const { html } = JSON.parse(body || "{}");
    if (!html) return res.status(400).json({ error: "Falta HTML en el body" });

    // ✅ Usar solo la ruta de chrome-aws-lambda
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: {
        width: 1080,
        height: 1920,
        deviceScaleFactor: 3,
      },
      executablePath: await chromium.executablePath, // 👈 clave
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const buffer = await page.screenshot({ type: "png" });
    await browser.close();

    res.setHeader("Content-Type", "image/png");
    res.send(buffer);
  } catch (err) {
    console.error("❌ Error render:", err);
    res
      .status(500)
      .json({ error: "Error al renderizar HTML", detail: err.message });
  }
}
