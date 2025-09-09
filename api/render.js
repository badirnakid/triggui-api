import { chromium } from "playwright";

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
    if (!html) {
      return res.status(400).json({ error: "Falta HTML en el body" });
    }

    // Lanzar Chromium incluido en Playwright
    const browser = await chromium.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    });

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1080, height: 1920 });
    await page.setContent(html, { waitUntil: "load" });

    // PNG retina-like
    const buffer = await page.screenshot({ type: "png" });
    await browser.close();

    res.setHeader("Content-Type", "image/png");
    res.send(buffer);
  } catch (err) {
    console.error("❌ Error render:", err);
    res
      .status(500)
      .json({ error: "Render falló", detail: err.message || err.toString() });
  }
}
