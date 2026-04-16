// ==========================================
// CONFIGURAÇÃO INICIAL
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initParticles();
  initContactForm();
  initSmoothScroll();
  initScrollEffects();
});

// ==========================================
// MENU HAMBURGUER
// ==========================================
function initMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');
  const menuLinks = document.querySelectorAll('.menu-link');

  if (!menuToggle || !menu) return;

  // Toggle do menu ao clicar no hamburguer
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    menu.classList.toggle('active');
  });

  // Fechar menu ao clicar em um link (mobile)
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        menuToggle.classList.remove('active');
        menu.classList.remove('active');
      }
    });
  });

  // Fechar menu ao clicar fora dele
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
      menuToggle.classList.remove('active');
      menu.classList.remove('active');
    }
  });

  // Fechar menu ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      menuToggle.classList.remove('active');
      menu.classList.remove('active');
    }
  });
}

// ==========================================
// SISTEMA DE PARTÍCULAS
// ==========================================
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Detectar preferência de animação reduzida
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    isReducedMotion = e.matches;
    if (isReducedMotion) {
      particles = [];
    }
  });

  // Redimensionar canvas
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Criar partículas
  function createParticles(x, y) {
    if (isReducedMotion) return;

    // Quantidade de partículas baseada no dispositivo
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 2 : 3;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x,
        y,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        life: isMobile ? 60 : 80,
        maxLife: isMobile ? 60 : 80
      });
    }

    // Limitar número de partículas para performance
    const maxParticles = isMobile ? 50 : 100;
    if (particles.length > maxParticles) {
      particles = particles.slice(-maxParticles);
    }
  }

  // Eventos de mouse (desktop)
  let isMouseDown = false;
  window.addEventListener('mousemove', (e) => {
    if (!isReducedMotion && window.innerWidth > 768) {
      createParticles(e.clientX, e.clientY);
    }
  });

  // Eventos de toque (mobile)
  window.addEventListener('touchmove', (e) => {
    if (!isReducedMotion) {
      const touch = e.touches[0];
      createParticles(touch.clientX, touch.clientY);
    }
  }, { passive: true });

  // Animar partículas
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.life--;

      // Fade out gradual
      const opacity = p.life / p.maxLife;
      ctx.fillStyle = `rgba(189, 14, 233, ${opacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Remover partículas mortas
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    });

    animationId = requestAnimationFrame(animate);
  }

  // Iniciar animação
  if (!isReducedMotion) {
    animate();
  }

  // Pausar animação quando a página não está visível
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else if (!isReducedMotion) {
      animate();
    }
  });
}

// ==========================================
// FORMULÁRIO DE CONTATO (WhatsApp)
// ==========================================
function initContactForm() {
  const form = document.getElementById('form-contato');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nomeInput = document.getElementById('nome');
    const mensagemInput = document.getElementById('mensagem');

    if (!nomeInput || !mensagemInput) return;

    const nome = nomeInput.value.trim();
    const mensagem = mensagemInput.value.trim();

    // Validação
    if (!nome) {
      showNotification('Por favor, digite seu nome', 'error');
      nomeInput.focus();
      return;
    }

    if (!mensagem) {
      showNotification('Por favor, digite sua mensagem', 'error');
      mensagemInput.focus();
      return;
    }

    // Número do WhatsApp (seu número)
    const numero = '5599984686139';

    // Montar mensagem
    const textoCompleto = `Olá, meu nome é ${nome}.\n\n${mensagem}`;

    // URL do WhatsApp
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(textoCompleto)}`;

    // Abrir WhatsApp
    window.open(url, '_blank');

    // Limpar formulário
    form.reset();

    // Feedback de sucesso
    showNotification('Redirecionando para o WhatsApp...', 'success');
  });
}

// Sistema de notificação
function showNotification(message, type = 'info') {
  // Remover notificação existente
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Criar notificação
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Estilos inline
  Object.assign(notification.style, {
    position: 'fixed',
    top: '80px',
    right: '20px',
    backgroundColor: type === 'error' ? '#e74c3c' : '#2ecc71',
    color: 'white',
    padding: '15px 20px',
    borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    zIndex: '10000',
    fontSize: '16px',
    fontFamily: 'Poppins, sans-serif',
    maxWidth: '90%',
    animation: 'slideIn 0.3s ease'
  });

  // Adicionar ao body
  document.body.appendChild(notification);

  // Remover após 3 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Adicionar animações de notificação ao CSS dinamicamente
if (!document.querySelector('#notification-styles')) {
  const style = document.createElement('style');
  style.id = 'notification-styles';
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// ==========================================
// SCROLL SUAVE
// ==========================================
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Ignorar links vazios
      if (href === '#' || !href) return;

      e.preventDefault();

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ==========================================
// EFEITOS DE SCROLL (ANIMAÇÕES)
// ==========================================
function initScrollEffects() {
  // Header com sombra ao scrollar
  const header = document.querySelector('.cabecalho');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 5px 20px rgba(189, 14, 233, 0.3)';
    } else {
      header.style.boxShadow = 'var(--cor-primaria) 0px 4px 6px -1px, var(--cor-primaria) 0px 2px 4px -1px';
    }
  });

  // Intersection Observer para animações de entrada
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observar elementos que devem animar na entrada
  const animatedElements = document.querySelectorAll('.habilidade-card, .projeto-card, .sobre p');
  animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });
}

// ==========================================
// PERFORMANCE E OTIMIZAÇÕES
// ==========================================

// Lazy loading para imagens
if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.src = img.dataset.src || img.src;
  });
} else {
  // Fallback para navegadores antigos
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/lazysizes@5.3.2/lazysizes.min.js';
  document.body.appendChild(script);
}

// Debounce para resize
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Otimizar resize
window.addEventListener('resize', debounce(() => {
  // Reconfigurar partículas se necessário
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
}, 250));

// ==========================================
// CONSOLE INFO (OPCIONAL)
// ==========================================
console.log('%c🚀 Portfolio Alex Sousa', 'color: #bd0ee9; font-size: 20px; font-weight: bold;');
console.log('%cDesenvolvido com ❤️ por Alex Sousa', 'color: #fff; font-size: 14px;');