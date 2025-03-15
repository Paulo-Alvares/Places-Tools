document.getElementById("linkForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const originalLink = document.getElementById("originalLink").value;

  const res = await fetch("/api/shorten", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ originalLink }),
  });

  const data = await res.json();

  if (data.shortLink) {
    document.getElementById("result").innerHTML = `
      <p>Link encurtado: <a href="${data.shortLink}" target="_blank">${data.shortLink}</a></p>
    `;
  }
});
