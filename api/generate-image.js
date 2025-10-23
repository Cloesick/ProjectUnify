export default async function handler(req, res) {
  try {
    const { prompt } = await req.json();

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt }],
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send(text);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
