export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://app.triggui.com");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const url = "https://raw.githubusercontent.com/badirnakid/triggui-content/main/contador.json";
  const response = await fetch(url);
  const data = await response.json();
  res.status(200).json({ total: data.total || 0 });
}
