// Tema claro/escuro com PNGs personalizados
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

// Função para atualizar o ícone do tema
function atualizarIconeTema() {
  if (html.getAttribute('data-theme') === 'dark') {
    themeIcon.src = 'dia.png';
    themeIcon.alt = 'Modo claro';
  } else {
    themeIcon.src = 'noite.png';
    themeIcon.alt = 'Modo escuro';
  }
}

// Inicialização do tema, fundo e ícone
if (themeStorage === 'dark') {
  html.setAttribute('data-theme', 'dark');
} else {
  html.setAttribute('data-theme', 'light');
}
atualizarFundoHero();
atualizarIconeTema();

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  if (current === 'dark') {
    html.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  } else {
    html.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
  atualizarFundoHero();
  atualizarIconeTema();
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
      // Mostra os projetos, esconde os detalhes se clicar no início
      if (href === "#projects-list") {
        document.getElementById('projects-list').style.display = 'block';
        document.getElementById('project-orcamento').style.display = 'none';
        document.getElementById('project-ecommerce').style.display = 'none';
      }
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

// ---- BLOCO DE PROJETOS ----
const projectCards = document.querySelectorAll('.project-card');
const projectOrcamento = document.getElementById('project-orcamento');
const projectEcommerce = document.getElementById('project-ecommerce');
const projectsList = document.getElementById('projects-list');

projectCards.forEach(card => {
  card.addEventListener('click', function() {
    projectsList.style.display = 'none';
    projectOrcamento.style.display = 'none';
    projectEcommerce.style.display = 'none';
    if (card.dataset.project === "orcamento") {
      projectOrcamento.style.display = 'block';
      setTimeout(() => projectOrcamento.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
    if (card.dataset.project === "ecommerce") {
      projectEcommerce.style.display = 'block';
      setTimeout(() => projectEcommerce.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  });
});

// BOTÃO "Voltar para o início"
document.getElementById('back-to-projects-orcamento').addEventListener('click', () => {
  projectOrcamento.style.display = 'none';
  projectsList.style.display = 'block';
  projectsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
document.getElementById('back-to-projects-ecommerce').addEventListener('click', () => {
  projectEcommerce.style.display = 'none';
  projectsList.style.display = 'block';
  projectsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
});