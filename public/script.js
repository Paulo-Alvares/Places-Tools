document.getElementById("linkForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const originalUrl = document.getElementById("originalUrl").value;

  try {
    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ originalUrl }),
    });

    if (!res.ok) {
      const errorText = await res.text(); // Para capturar a mensagem de erro do servidor
      throw new Error(`Erro: ${res.status} - ${errorText}`);
    }

    const data = await res.json();

    if (data.shortUrl) {
      document.getElementById("result").innerHTML = `
        <p>Link encurtado: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a></p>
      `;
    }
  } catch (error) {
    console.error("Erro ao encurtar link:", error);
    document.getElementById("result").innerHTML = `
      <p style="color: red;">Erro ao encurtar link: ${error.message}</p>
    `;
  }
});
