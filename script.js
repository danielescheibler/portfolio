// Tema claro/escuro
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeStorage = localStorage.getItem('theme');

// Função para trocar o fundo do header conforme o tema
function atualizarFundoHero() {
  const bg = document.querySelector('.site-hero-bg');
  if (html.getAttribute('data-theme') === 'dark') {
    bg.style.backgroundImage = "url('fundo_dark.jpg')";
  } else {
    bg.style.backgroundImage = "url('fundo.jpg')";
  }
}

// Inicialização do tema e do fundo
if (themeStorage === 'dark') {
  html.setAttribute('data-theme', 'dark');
  themeIcon.textContent = '☀️';
} else {
  html.setAttribute('data-theme', 'light');
  themeIcon.textContent = '🌙';
}
atualizarFundoHero();

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  if (current === 'dark') {
    html.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    themeIcon.textContent = '🌙';
  } else {
    html.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    themeIcon.textContent = '☀️';
  }
  atualizarFundoHero();
});

// Botão voltar ao topo
const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 350) {
    backToTopBtn.style.display = 'block';
    setTimeout(() => backToTopBtn.style.opacity = '1', 100);
  } else {
    backToTopBtn.style.opacity = '0';
    setTimeout(() => backToTopBtn.style.display = 'none', 350);
  }
});
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Navegação ativa e scroll suave
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
      this.classList.add('active');
      const section = document.querySelector(href);
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Marca botão ativo conforme rolagem
const navLinks = document.querySelectorAll('.nav-link');
const sections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute('href')));
window.addEventListener('scroll', () => {
  let scrollPos = window.scrollY || window.pageYOffset;
  let selected = 0;
  sections.forEach((section, idx) => {
    if (section && section.offsetTop - 120 <= scrollPos) {
      selected = idx;
    }
  });
  navLinks.forEach(a => a.classList.remove('active'));
  navLinks[selected].classList.add('active');
});

// Idioma PT | EN (só visual, para trocar textos adicione lógica)
const langBtns = document.querySelectorAll('.lang-btn');
let lang = 'pt';
langBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    langBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    lang = this.dataset.lang;
    // Aqui você pode trocar textos se desejar, atualmente só altera visual
  });
});