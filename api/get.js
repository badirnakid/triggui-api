export default async function handler(req, res) {
  const url = "https://raw.githubusercontent.com/badirnakid/triggui-content/main/contador.json";
  const response = await fetch(url);
  const data = await response.json();
  res.status(200).json({ total: data.total || 0 });
}
