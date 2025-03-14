const shortenBtn = document.getElementById("shortenBtn");
const result = document.getElementById("result");

shortenBtn.addEventListener("click", async () => {
  const originalUrl = document.getElementById("originalUrl").value;

  if (!originalUrl) {
    alert("Por favor, insira um link!");
    return;
  }

  try {
    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: originalUrl }),
    });

    if (!response.ok) throw new Error("Erro ao encurtar o link");

    const data = await response.json();

    if (data.shortUrl) {
      result.innerHTML = `<a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
    }
  } catch (error) {
    alert(`Erro: ${error.message}`);
  }
});
