export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN;
  const repo = "triggui-content";
  const owner = "badirnakid";
  const filePath = "contador.json";

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const headers = {
    Authorization: `token ${token}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github.v3+json"
  };

  const response = await fetch(url, { headers });
  const data = await response.json();
  const content = JSON.parse(atob(data.content));
  const newCount = (content.total || 0) + 1;

  const updatedContent = {
    total: newCount
  };

  const result = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: "Incrementar contador",
      content: btoa(JSON.stringify(updatedContent, null, 2)),
      sha: data.sha
    })
  });

  res.status(200).json({ success: true, total: newCount });
}
