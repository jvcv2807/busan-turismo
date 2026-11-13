/**
 * Visit Busan (부산) — Turismo & Cultura
 * Scripts de Interatividade e Funcionalidades
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Tema Claro / Escuro
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const currentTheme = localStorage.getItem('busan-theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('busan-theme', theme);
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      applyTheme(activeTheme === 'dark' ? 'light' : 'dark');
    });
  }

  // 2. Menu Mobile
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('is-active');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-active');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Filtro de Atrações
  const filterBtns = document.querySelectorAll('.filter-btn');
  const attractionCards = document.querySelectorAll('.card-attraction');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      attractionCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 4. Calculadora Conversora de Moeda (KRW <-> BRL)
  // Cotação de referência: ~1 BRL = 250 KRW (ou 1.000 KRW = ~R$ 4,00)
  const krwRate = 250;
  const inputKrw = document.getElementById('inputKrw');
  const outputBrl = document.getElementById('outputBrl');
  const styleSelect = document.getElementById('travelStyle');
  const styleEstimate = document.getElementById('styleEstimate');

  function updateConversion() {
    if (!inputKrw || !outputBrl) return;
    const krw = parseFloat(inputKrw.value) || 0;
    const brl = krw / krwRate;
    outputBrl.textContent = brl.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  }

  if (inputKrw) {
    inputKrw.addEventListener('input', updateConversion);
    updateConversion();
  }

  // Estimador de Gasto Diário
  const dailyBudgets = {
    backpacker: { krw: 50000, desc: 'Hostels, comida de rua no Jagalchi, metrô' },
    moderate: { krw: 120000, desc: 'Hotel 3-4★ em Haeundae, cafés, restaurantes tradicionais' },
    luxury: { krw: 300000, desc: 'Resorts de praia, frutos do mar premium, táxis privativos' }
  };

  if (styleSelect && styleEstimate) {
    styleSelect.addEventListener('change', () => {
      const selected = dailyBudgets[styleSelect.value];
      if (selected) {
        const brlValue = (selected.krw / krwRate).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const krwFormatted = selected.krw.toLocaleString('pt-BR') + ' ₩';
        styleEstimate.innerHTML = `Média: <strong>${krwFormatted} (${brlValue})/dia</strong><br><small style="color:var(--text-muted)">${selected.desc}</small>`;
      }
    });
  }

  // 5. Modal de Detalhes da Atração
  const modal = document.getElementById('attractionModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalClose = document.getElementById('modalClose');

  if (modal && modalClose) {
    document.querySelectorAll('.open-details-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const card = e.target.closest('.card-attraction');
        if (!card) return;

        const title = card.querySelector('.card-title')?.textContent;
        const desc = card.querySelector('.card-desc')?.textContent;
        const details = card.getAttribute('data-full-info') || desc;

        modalTitle.textContent = title;
        modalDesc.textContent = details;
        modal.style.display = 'flex';
      });
    });

    modalClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
});
