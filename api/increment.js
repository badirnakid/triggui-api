import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
  // 👉 Permitir peticiones desde app.triggui.com
  res.setHeader("Access-Control-Allow-Origin", "https://app.triggui.com");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 👉 Responder a preflight (opcional, pero recomendable)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const owner = "badirnakid"; // tu usuario de GitHub
  const repo = "triggui-content"; // tu repo con contador.json
  const path = "contador.json";

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  try {
    // Obtener el contenido actual
    const { data: file } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    const content = Buffer.from(file.content, "base64").toString("utf8");
    const json = JSON.parse(content);
    const total = (json.total || 0) + 1;

    // Actualizar el contenido con el nuevo total
    const newContent = Buffer.from(JSON.stringify({ total }, null, 2)).toString("base64");

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `increment total to ${total}`,
      content: newContent,
      sha: file.sha,
    });

    res.status(200).json({ success: true, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
