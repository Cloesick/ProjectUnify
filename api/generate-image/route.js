export const config = { runtime: "edge" };

export default async function handler(req) {
  const origin = req.headers.get("origin") || "";

  // ✅ Preflight check
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(origin),
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders(origin),
    });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Missing prompt" }), {
        status: 400,
        headers: corsHeaders(origin),
      });
    }

    // ✅ Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
      }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: corsHeaders(origin),
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders(origin),
    });
  }
}

function corsHeaders(origin) {
  const allowedOrigins = [
    "https://cloesick.github.io",
    "http://localhost:3000",  // for local dev
  ];

  const allowed =
    allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    "Content-Type": "application/json",
  };
}
