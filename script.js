// Tema claro/escuro com PNGs personalizados e fundo mobile dinâmico
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeStorage = localStorage.getItem('theme');

// Função para detectar mobile
function isMobile() {
  return window.innerWidth <= 700;
}

// Função para trocar o fundo do header conforme o tema e device
function atualizarFundoHero() {
  const bg = document.querySelector('.site-hero-bg');
  if (isMobile()) {
    if (html.getAttribute('data-theme') === 'dark') {
      bg.style.backgroundImage = "url('fundo_celular_escuro.png')";
    } else {
      bg.style.backgroundImage = "url('fundo_celular_claro.png')";
    }
  } else {
    if (html.getAttribute('data-theme') === 'dark') {
      bg.style.backgroundImage = "url('fundo_dark.jpg')";
    } else {
      bg.style.backgroundImage = "url('fundo.jpg')";
    }
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

window.addEventListener('resize', atualizarFundoHero);

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

// MENU MOBILE (hamburguer)
const menuToggleBtn = document.getElementById('menu-toggle');
const headerNav = document.getElementById('header-nav');
const menuOverlay = document.getElementById('menu-overlay');

function closeMenu() {
  headerNav.classList.remove('active');
  menuOverlay.classList.remove('active');
}

menuToggleBtn.addEventListener('click', () => {
  headerNav.classList.toggle('active');
  menuOverlay.classList.toggle('active');
});

menuOverlay.addEventListener('click', () => {
  closeMenu();
});

// Fecha menu ao clicar em link
headerNav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (isMobile()) closeMenu();
  });
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

// ---- BLOCO DE PROJETOS ----
const projectCards = document.querySelectorAll('.project-card');
const projectOrcamento = document.getElementById('project-orcamento');
const projectEcommerce = document.getElementById('project-ecommerce');
const projectsList = document.getElementById('projects-list');

if (projectCards && projectsList) {
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
}

// ---- Troca de idioma (PT/EN) ----
const langBtns = document.querySelectorAll('.lang-btn');
let lang = 'pt';

// Traduções
const i18n = {
  pt: {
    home: "Página Inicial",
    about: "Sobre Mim",
    contact: "Contato",
    "about-title": "Sobre Mim",
    "about-role": "UX/UI Designer e Criadora Visual",
    "about-text": `Me chamo <b>Daniele Scheibler</b>, sou UX/UI Designer com formação em Ciências Biológicas e background em design gráfico, edição de vídeos e motion design.<br>
      Natural do Rio Grande do Sul, iniciei minha trajetória acadêmica pela ciência, mas encontrei nas artes visuais minha verdadeira paixão.<br>
      Hoje atuo como profissional autônoma criando identidades visuais, conteúdos digitais e experiências centradas no usuário.<br>`,
    "about-tools": "Ferramentas e Tecnologias",
    "orcamento-title": "Orçamento de Serviços Express",
    "orcamento-desc": "UX/UI para otimizar orçamentos de vídeo e facilitar a vida do profissional audiovisual.",
    "ecommerce-title": "E-commerce (Projeto Fictício)",
    "ecommerce-desc": "Experiência de compra digital, design de interface e jornada do usuário para loja online.",
    footer: "Desenvolvido por <b>Daniele Scheibler</b> • 2025"
  },
  en: {
    home: "Home",
    about: "About Me",
    contact: "Contact",
    "about-title": "About Me",
    "about-role": "UX/UI Designer & Visual Creator",
    "about-text": `My name is <b>Daniele Scheibler</b>, I'm a UX/UI Designer with a background in Biological Sciences, graphic design, video editing and motion design.<br>
      Born in Rio Grande do Sul, I started my academic path in science, but found my true passion in the visual arts.<br>
      Today I work as a freelance professional creating visual identities, digital content, and user-centered experiences.<br>`,
    "about-tools": "Tools & Technologies",
    "orcamento-title": "Services Budget Express",
    "orcamento-desc": "UX/UI to optimize video budgets and make life easier for audiovisual professionals.",
    "ecommerce-title": "E-commerce (Fictional Project)",
    "ecommerce-desc": "Digital shopping experience, interface design and user journey for an online store.",
    footer: "Developed by <b>Daniele Scheibler</b> • 2025"
  }
};

function traduzirSite(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (i18n[lang][key]) {
      el.innerHTML = i18n[lang][key];
    }
  });
  document.documentElement.setAttribute("lang", lang);
}

langBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    langBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    lang = this.dataset.lang;
    traduzirSite(lang);
  });
});

// Inicializa idioma
traduzirSite(lang);