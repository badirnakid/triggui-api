export default async function handler(req, res) {
  const allowedOrigins = ["https://app.triggui.com", "https://triggui.com"];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const url = "https://raw.githubusercontent.com/badirnakid/triggui-content/main/contador.json";
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json({ total: data.total || 0 });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el contador." });
  }
}
