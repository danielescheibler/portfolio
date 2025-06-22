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

// Salva o idioma escolhido no localStorage e mantém selecionado após reload
let lang = localStorage.getItem('lang') || 'pt';

function carregarIdioma(lang) {
  fetch(`langs/${lang}.json`)
    .then(res => res.json())
    .then(traducao => {
      // Textos
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (traducao[key]) el.innerHTML = traducao[key];
      });
      // Imagens
      document.querySelectorAll("[data-i18n-img]").forEach(el => {
        const key = el.getAttribute("data-i18n-img");
        if (traducao[key]) el.src = traducao[key];
      });

      // Troca gráfico mobile do processo ao trocar idioma
      trocarGraficoProcessoMobile(lang);

      // Troca imagem mobile dos próximos passos ao trocar idioma
      trocarProximosPassosMobile(lang);

      document.documentElement.setAttribute("lang", lang);
      localStorage.setItem('lang', lang);
    });
}

function trocarGraficoProcessoMobile(lang) {
  const mobileSrc = document.getElementById('grafico-processo-mobile');
  if (mobileSrc) {
    if (lang === 'en') {
      mobileSrc.srcset = 'assets/processodoprojeto_mobileen.png';
    } else {
      mobileSrc.srcset = 'assets/processodoprojeto_mobile.png';
    }
    // Força o browser a reavaliar o <picture>
    const img = document.getElementById('grafico-processo');
    if (img) img.src = img.src;
  }
}

function trocarProximosPassosMobile(lang) {
  const mobileSrc = document.getElementById('proximos-passos-mobile');
  if (mobileSrc) {
    if (lang === 'en') {
      mobileSrc.srcset = 'assets/passosmobile_en.png';
    } else {
      mobileSrc.srcset = 'assets/passosmobile.png';
    }
    // Força o browser a reavaliar o <picture>
    const img = document.getElementById('proximos-passos');
    if (img) img.src = img.src;
  }
}

// Carrega partials e só então inicia lógicas
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
    const graficos = document.querySelectorAll('#grafico-processo');
    graficos.forEach(img => {
      if (!img) return;
      var tema = document.documentElement.getAttribute('data-theme');
      img.src = (tema === "dark")
        ? "assets/processodoprojeto_dark.png"
        : "assets/processodoprojeto.png";
    });
  }
  atualizarGraficoProcesso();
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
      atualizarGraficoProcesso();
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
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

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
        if (href === "#projects-list") {
          document.getElementById('projects-list').style.display = 'block';
          document.getElementById('project-orcamento').style.display = 'none';
          document.getElementById('project-ecommerce').style.display = 'none';
        }
      }
    });
  });
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
        atualizarGraficoProcesso();
        // Reaplica tradução ao trocar de "página" interna
        carregarIdioma(localStorage.getItem('lang') || 'pt');
      });
    });

    // Botão voltar do orçamento
    const backOrcamento = document.getElementById('back-to-projects-orcamento');
    if (backOrcamento && projectOrcamento && projectsList) {
      backOrcamento.addEventListener('click', () => {
        projectOrcamento.style.display = 'none';
        projectsList.style.display = 'block';
        projectsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
        carregarIdioma(localStorage.getItem('lang') || 'pt');
      });
    }
    // Botão voltar do e-commerce
    const backEcommerce = document.getElementById('back-to-projects-ecommerce');
    if (backEcommerce && projectEcommerce && projectsList) {
      backEcommerce.addEventListener('click', () => {
        projectEcommerce.style.display = 'none';
        projectsList.style.display = 'block';
        projectsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
        carregarIdioma(localStorage.getItem('lang') || 'pt');
      });
    }
  }
  setupProjectNavigation();

  // 9. IDIOMA (PT/EN) - textos e imagens marcados com data-i18n/data-i18n-img
  // ATENÇÃO: langBtns pode não existir até partial ser carregado!
  function bindLangBtns() {
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        lang = this.dataset.lang;
        carregarIdioma(lang);
        langBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
      });
    });
    // Marca botão ativo
    langBtns.forEach(b => b.classList.remove('active'));
    const btn = Array.from(langBtns).find(b => b.dataset.lang === lang);
    if (btn) btn.classList.add('active');
  }
  // Bind após partials carregados
  bindLangBtns();

  // Aplica idioma salvo/localStorage após carregar tudo
  carregarIdioma(lang);

  // Se partials forem recarregados dinamicamente em outros fluxos, reaplicar idioma (SPA)
  // Opcional: MutationObserver para garantir tradução mesmo se blocos mudarem dinamicamente
  // Se não usar SPA, pode remover este bloco
  // const observerPartial = new MutationObserver(() => {
  //   carregarIdioma(localStorage.getItem('lang') || 'pt');
  // });
  // observerPartial.observe(document.body, { childList: true, subtree: true });

});
