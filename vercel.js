fetch("https://project-unify.vercel.app/api/generate-image", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt: "a scenic mountain at sunrise" })
})
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(console.error);
