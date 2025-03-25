let originalUrlInput = document.getElementById("original_url");

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
    document.getElementById("result").innerHTML = `
      <a href="${shortUrl}" target="_blank">${shortUrl}</a>
      <div class="copy" onclick="copyToClipboard(event)">
        <img src="assets/copy_icon.svg" alt="Ícone de Cópia" />
      </div>
      `;

    loadLinks();
  } catch (error) {
    console.error("Erro ao encurtar URL:", error);
    document.getElementById("result").textContent =
      "Erro inesperado ao encurtar a URL.";
  }
}

originalUrlInput.addEventListener("paste", async (e) => {
  e.preventDefault();

  const text = e.clipboardData.getData("text/plain");
  originalUrlInput.value = text
  
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

function copyToClipboard(event) {
  var copyButton = event.currentTarget;

  var textToCopyElement = copyButton.parentElement.querySelector("a");

  if (textToCopyElement) {
    var textToCopy = textToCopyElement.href || textToCopyElement.innerText;

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
  } else {
    console.error(
      "Não foi possível encontrar o elemento de texto para copiar."
    );
  }
}

async function loadLinks() {
  const response = await fetch("/api/list");
  if (!response.ok) {
    const error = await response.json();
    alert(`Erro: ${error.error}`);
    return;
  }

  const links = await response.json();
  const cards = document.getElementById("cards");

  cards.innerHTML = "";

  links.forEach((link) => {
    const row = document.createElement("div");
    row.innerHTML = `
      <div class="card">
        <div class="card_link">
          <a href="https://placestools.vercel.app/${link.short_url}" target="_blank">
            https://placestools.vercel.app/${link.short_url}
          </a>
          <div class="copy" onclick="copyToClipboard(event)">
            <img src="assets/copy_icon.svg" alt="Ícone de Cópia" />
          </div>
        </div>
        <div class="bar"></div>
        <p>${link.clicks}</p>
      </div>
    `;
    cards.appendChild(row);
  });
}
