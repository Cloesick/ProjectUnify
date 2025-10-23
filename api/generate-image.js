export const config = {
  runtime: 'nodejs18.x',
};

export default async function handler(req, res) {
  try {
    const body = req.body || (await new Response(req.body).json());
    const { prompt } = body || {};

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `Generate a realistic photo of ${prompt}` }],
            },
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
