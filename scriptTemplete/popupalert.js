document.addEventListener("DOMContentLoaded", () => {
  const container = document.createElement("div");
  container.id = "alert-container";
  container.className =
    "fixed top-5 right-5 z-[9999] flex flex-col space-y-3 sm:max-w-sm w-[90%] sm:w-auto";
  document.body.appendChild(container);

  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(100%); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeOut {
      from { opacity: 1; transform: translateX(0); }
      to { opacity: 0; transform: translateX(100%); }
    }
    .animate-slideIn { animation: slideIn 0.4s ease-out forwards; }
    .animate-fadeOut { animation: fadeOut 0.4s ease-in forwards; }
  `;
  document.head.appendChild(style);
});

function showAlert(message, type = "info", duration = 4000) {
  const colors = {
    success: "from-green-500 to-green-600 border-green-700",
    error: "from-red-500 to-red-600 border-red-700",
    warning: "from-yellow-400 to-yellow-500 border-yellow-600 text-gray-900",
    info: "from-blue-500 to-blue-600 border-blue-700",
  };

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  const alert = document.createElement("div");
  alert.className = `
    flex items-center gap-3 text-white px-4 py-3 rounded-lg shadow-lg border
    bg-gradient-to-r ${colors[type] || colors.info} animate-slideIn
  `;
  alert.setAttribute("role", "alert");

  alert.innerHTML = `
    <span class="text-xl">${icons[type] || icons.info}</span>
    <span class="flex-1 font-medium text-sm">${message}</span>
    <button
      class="text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40 rounded"
      aria-label="Fechar alerta"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  `;

  const closeBtn = alert.querySelector("button");
  closeBtn.addEventListener("click", () => dismissAlert(alert));

  const container = document.getElementById("alert-container");
  container.appendChild(alert);

  if (duration > 0) setTimeout(() => dismissAlert(alert), duration);
}

function dismissAlert(alert) {
  alert.classList.remove("animate-slideIn");
  alert.classList.add("animate-fadeOut");
  setTimeout(() => alert.remove(), 400);
}
