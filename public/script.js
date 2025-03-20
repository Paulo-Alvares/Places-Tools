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
    ).innerHTML = `<a href="${shortUrl}" target="_blank">${shortUrl}</a>`;

    loadLinks();
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

function copyToClipboard() {
  var textToCopy = document.getElementById("result").innerText;
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      var modal = document.querySelector(".modal");
      modal.classList.add("active");
      setTimeout(() => {
        modal.classList.remove("active");
      }, 2000);
    })
    .catch((err) => {
      console.error("Erro ao copiar texto: ", err);
    });
}

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
        <a href="https://placestools.vercel.app/${link.short_url}" target="_blank">https://placestools.vercel.app/
          ${link.short_url}
        </a>
      </div>
      <div>${link.clicks}</div>
    `;
    rightSide.appendChild(row);
  });
}
