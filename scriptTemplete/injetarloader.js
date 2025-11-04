// injetarLoader.js
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/templete/loader.html");
    const loaderHTML = await response.text();
    document.body.insertAdjacentHTML("afterbegin", loaderHTML);
  } catch (error) {
    console.error("Erro ao carregar o loader:", error);
  }
});
