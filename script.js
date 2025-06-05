// 1. Inicializa tema ANTES de carregar partials
const html = document.documentElement;
const themeStorage = localStorage.getItem('theme');
if (themeStorage === 'dark') {
  html.setAttribute('data-theme', 'dark');
} else {
  html.setAttribute('data-theme', 'light');
}

// 2. Carrega partials
const partials = [
  { id: 'header', file: 'partials/header.html' },
  { id: 'sobre', file: 'partials/sobre.html' },
  { id: 'projects-list', file: 'partials/projetos.html' },
  { id: 'project-orcamento', file: 'partials/projeto-orcamento.html' },
  { id: 'project-ecommerce', file: 'partials/projeto-ecommerce.html' },
  { id: 'footer', file: 'partials/footer.html' }
];

Promise.all(partials.map(part =>
  fetch(part.file).then(r => r.text()).then(content => {
    document.getElementById(part.id).innerHTML = content;
  })
)).then(() => {

  // 3. FUNDO DO HERO (tema e responsivo)
  function isMobile() {
    return window.innerWidth <= 700;
  }
  function atualizarFundoHero() {
    const bg = document.querySelector('.site-hero-bg');
    if (!bg) return;
    if (isMobile()) {
      if (html.getAttribute('data-theme') === 'dark') {
        bg.style.backgroundImage = "url('assets/fundo_celular_escuro.png')";
      } else {
        bg.style.backgroundImage = "url('assets/fundo_celular_claro.png')";
      }
    } else {
      if (html.getAttribute('data-theme') === 'dark') {
        bg.style.backgroundImage = "url('assets/fundo_dark.jpg')";
      } else {
        bg.style.backgroundImage = "url('assets/fundo.jpg')";
      }
    }
  }

  // 3.1. TROCA O GRÁFICO DO PROCESSO CONFORME TEMA
  function atualizarGraficoProcesso() {
    // Pode ter mais de um gráfico em algumas páginas, trate todos!
    const graficos = document.querySelectorAll('#grafico-processo');
    graficos.forEach(img => {
      if (!img) return;
      var tema = document.documentElement.getAttribute('data-theme');
      img.src = (tema === "dark")
        ? "assets/processodoprojeto_dark.png"
        : "assets/processodoprojeto.png";
    });
  }
  // Chama a função ao carregar partials (garante troca ao entrar na página)
  atualizarGraficoProcesso();
  // Observa mudanças no atributo data-theme no <html>
  const observerGrafico = new MutationObserver(atualizarGraficoProcesso);
  observerGrafico.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // 4. TEMA CLARO/ESCURO
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  function atualizarIconeTema() {
    if (!themeIcon) return;
    if (html.getAttribute('data-theme') === 'dark') {
      themeIcon.src = 'assets/dia.png';
      themeIcon.alt = 'Modo claro';
    } else {
      themeIcon.src = 'assets/noite.png';
      themeIcon.alt = 'Modo escuro';
    }
  }
  atualizarFundoHero();
  atualizarIconeTema();
  window.addEventListener('resize', atualizarFundoHero);

  if (themeToggle) {
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
      atualizarGraficoProcesso(); // Atualiza o gráfico manualmente ao clicar no botão!
    });
  }

  // 5. BOTÃO VOLTAR AO TOPO
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

  // 6. MENU MOBILE (hamburguer)
  const menuToggleBtn = document.getElementById('menu-toggle');
  const headerNav = document.getElementById('header-nav');
  const menuOverlay = document.getElementById('menu-overlay');
  function closeMenu() {
    headerNav.classList.remove('active');
    menuOverlay.classList.remove('active');
  }
  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', () => {
      headerNav.classList.toggle('active');
      menuOverlay.classList.toggle('active');
    });
  }
  if (menuOverlay) {
    menuOverlay.addEventListener('click', () => {
      closeMenu();
    });
  }
  if (headerNav) {
    headerNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (isMobile()) closeMenu();
      });
    });
  }

  // 7. NAVEGAÇÃO SUAVE E BOTÕES ATIVOS
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
        const section = document.querySelector(href);
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Mostra projetos, esconde detalhes se for início
        if (href === "#projects-list") {
          document.getElementById('projects-list').style.display = 'block';
          document.getElementById('project-orcamento').style.display = 'none';
          document.getElementById('project-ecommerce').style.display = 'none';
        }
      }
    });
  });
  // Atualiza botão ativo conforme scroll
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

  // 8. NAVEGAÇÃO ENTRE PROJETOS
  function setupProjectNavigation() {
    const projectsList = document.getElementById('projects-list');
    const projectOrcamento = document.getElementById('project-orcamento');
    const projectEcommerce = document.getElementById('project-ecommerce');
    if (projectsList) projectsList.style.display = 'block';
    if (projectOrcamento) projectOrcamento.style.display = 'none';
    if (projectEcommerce) projectEcommerce.style.display = 'none';

    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', function () {
        if (projectsList) projectsList.style.display = 'none';
        if (projectOrcamento) projectOrcamento.style.display = (card.dataset.project === "orcamento" ? 'block' : 'none');
        if (projectEcommerce) projectEcommerce.style.display = (card.dataset.project === "ecommerce" ? 'block' : 'none');
        setTimeout(() => {
          if (card.dataset.project === "orcamento" && projectOrcamento) projectOrcamento.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (card.dataset.project === "ecommerce" && projectEcommerce) projectEcommerce.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
        atualizarGraficoProcesso(); // Garante troca do gráfico ao abrir detalhes
      });
    });

    // Botão voltar do orçamento
    const backOrcamento = document.getElementById('back-to-projects-orcamento');
    if (backOrcamento && projectOrcamento && projectsList) {
      backOrcamento.addEventListener('click', () => {
        projectOrcamento.style.display = 'none';
        projectsList.style.display = 'block';
        projectsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    // Botão voltar do e-commerce
    const backEcommerce = document.getElementById('back-to-projects-ecommerce');
    if (backEcommerce && projectEcommerce && projectsList) {
      backEcommerce.addEventListener('click', () => {
        projectEcommerce.style.display = 'none';
        projectsList.style.display = 'block';
        projectsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }
  setupProjectNavigation();

  // 9. IDIOMA (PT/EN) - só texto marcado com data-i18n
  const langBtns = document.querySelectorAll('.lang-btn');
  let lang = 'pt';
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
  traduzirSite(lang);

});