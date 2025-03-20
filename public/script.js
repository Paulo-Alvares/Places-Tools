async function shortenUrl(url) {
  try {
    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const error = await response.json();
      document.getElementById("result").textContent = `Erro: ${error.error}`;
      return;
    }

    const result = await response.json();
    const shortUrl = `https://placestools.vercel.app/${result.short_url}`;
    document.getElementById(
      "result"
    ).innerHTML = `URL encurtada: <a href="${shortUrl}" target="_blank">${shortUrl}</a>`;
  } catch (error) {
    console.error("Erro ao encurtar URL:", error);
    document.getElementById("result").textContent =
      "Erro inesperado ao encurtar a URL.";
  }
}

document.getElementById("original_url").addEventListener("paste", async (e) => {
  e.preventDefault();

  const text = e.clipboardData.getData("text/plain");
  if (text) {
    shortenUrl(text);
  }
});

window.addEventListener("unhandledrejection", (event) => {
  console.error(
    "Unhandled rejection (promise: %s, reason: %s)",
    event.promise,
    event.reason
  );
  document.getElementById("result").textContent =
    "Ocorreu um erro ao processar a requisição.  Tente novamente mais tarde.";
});

async function loadLinks() {
  const response = await fetch("/api/list");
  if (!response.ok) {
    const error = await response.json();
    alert(`Erro: ${error.error}`);
    return;
  }

  const links = await response.json();
  const rightSide = document.getElementById("rigth_side");

  rightSide.innerHTML = "";

  links.forEach((link) => {
    const row = document.createElement("div");
    row.innerHTML = `
      <div>
        <a href="https://placestools.vercel.app/${
          link.short_url
        }" target="_blank">https://placestools.vercel.app/
          ${link.short_url}
        </a>
      </div>
      <div>${link.clicks}</div>
    `;
    rightSide.appendChild(row);
  });
}
