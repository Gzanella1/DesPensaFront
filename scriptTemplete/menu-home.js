// templete/js/menu-home.js

const toggleBtn = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

toggleBtn.addEventListener("click", () => {
  if (navLinks.classList.contains("hidden")) {
    navLinks.classList.remove("hidden");
    navLinks.classList.add("animate-slideFadeIn");
  } else {
    navLinks.classList.add("hidden");
    navLinks.classList.remove("animate-slideFadeIn");
  }
});

// Fecha o menu ao clicar em um link (mobile)
document.querySelectorAll('#nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.add('hidden');
    navLinks.classList.remove('animate-slideFadeIn');
  });
});

// Scroll suave para seções
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});
