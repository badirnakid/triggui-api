import chromium from "chrome-aws-lambda";

export default async function handler(req, res) {
  try {
    // 1. Obtener HTML del body
    const { html } = req.body || {};
    if (!html) {
      return res.status(400).json({ error: "Falta HTML" });
    }

    // 2. Lanzar Chrome headless en entorno serverless
    const browser = await chromium.puppeteer.launch({
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: { width: 1080, height: 1920, deviceScaleFactor: 3 },
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // 3. Tomar screenshot en PNG
    const buffer = await page.screenshot({ type: "png" });

    await browser.close();

    // 4. Responder con la imagen
    res.setHeader("Content-Type", "image/png");
    res.send(buffer);
  } catch (err) {
    console.error("❌ Error render:", err);
    res.status(500).json({ error: "Error al renderizar HTML" });
  }
}
