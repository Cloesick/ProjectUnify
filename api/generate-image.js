export const config = {
  runtime: 'nodejs', // Correct modern value
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const body = await new Promise((resolve) => {
      let data = "";
      req.on("data", (chunk) => (data += chunk));
      req.on("end", () => resolve(JSON.parse(data || "{}")));
    });

    const { prompt } = body;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    if (!process.env.GEMINI_API_KEY)
      return res.status(500).json({ error: "Missing GEMINI_API_KEY" });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: `Generate a photo of ${prompt}` }] }
          ],
        }),
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Handler error:", err);
    res.status(500).json({ error: err.message });
  }
}
