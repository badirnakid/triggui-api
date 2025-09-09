import { chromium } from "@playwright/test";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido, usa POST" });
  }

  try {
    // Parsear body
    let body = "";
    await new Promise((resolve) => {
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", resolve);
    });

    const { html } = JSON.parse(body || "{}");
    if (!html) return res.status(400).json({ error: "Falta HTML en el body" });

    // Lanzar Chromium de Playwright
    const browser = await chromium.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1080, height: 1920 });
    await page.setContent(html, { waitUntil: "networkidle" });

    // Screenshot retina-like (simular scale 3 con mayor resolución)
    const buffer = await page.screenshot({ type: "png", scale: "device" });

    await browser.close();

    res.setHeader("Content-Type", "image/png");
    res.send(buffer);
  } catch (err) {
    console.error("❌ Error render:", err);
    res.status(500).json({ error: "Error al renderizar HTML", detail: err.message });
  }
}
