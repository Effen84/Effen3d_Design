document.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) header.style.background = '#000';
    else header.style.background = 'rgba(0,0,0,0.9)';
});
// --- Filtros do portefólio ---
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery .item');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // estado ativo
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      items.forEach(it => {
        const cat = it.dataset.cat;
        if (filter === 'all' || cat === filter) {
          it.classList.remove('hide');
        } else {
          it.classList.add('hide');
        }
      });
    });
  });
});
// --- Lightbox ---
const images = document.querySelectorAll('.gallery img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close');

images.forEach(img => {
  img.addEventListener('click', () => {
    lightbox.style.display = 'block';
    lightboxImg.src = img.src;
  });
});

closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.style.display = 'none';
});
// --- Lightbox ---
(function () {
  const container = document.getElementById('lightbox');
  const imgTarget = document.getElementById('lightbox-img');
  const closeBtn = container?.querySelector('.close');
  const thumbs = document.querySelectorAll('.gallery img');

  if (!container || !imgTarget || thumbs.length === 0) return;

  // abrir ao clicar na miniatura
  thumbs.forEach(t => {
    t.addEventListener('click', () => {
      imgTarget.src = t.getAttribute('src');
      imgTarget.alt = t.getAttribute('alt') || '';
      container.classList.add('open');
      container.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // evita scroll do fundo
    });
  });

  // fechar (botão X, clique fora, tecla Esc)
  function closeLightbox() {
    container.classList.remove('open');
    container.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // opcional: limpar src para libertar memória
    // imgTarget.removeAttribute('src');
  }

  closeBtn?.addEventListener('click', closeLightbox);

  container.addEventListener('click', (e) => {
    if (e.target === container) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && container.classList.contains('open')) {
      closeLightbox();
    }
  });
})();
// --- Orçamento: abrir/fechar modal
(function(){
  const openers = [document.getElementById('openQuote'), document.getElementById('openQuote2')].filter(Boolean);
  const backdrop = document.getElementById('quoteBackdrop');
  const closeBtn = document.getElementById('closeQuote');
  const form = document.getElementById('quoteForm');

  const open = (e)=>{ e?.preventDefault(); backdrop.classList.add('open'); document.body.style.overflow='hidden'; };
  const close = ()=>{ backdrop.classList.remove('open'); document.body.style.overflow=''; };

  openers.forEach(btn => btn.addEventListener('click', open));
  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', (e)=>{ if(e.target===backdrop) close(); });

  // --- Submit: gera mailto
  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('qName').value.trim();
    const email = document.getElementById('qEmail').value.trim();
    const cat = document.getElementById('qCategory').value;
    const desc = document.getElementById('qDesc').value.trim();
    const deadline = document.getElementById('qDeadline').value.trim();

    if(!name || !email || !desc){ alert('Preenche Nome, Email e Descrição.'); return; }

    const subject = encodeURIComponent(`Pedido de orçamento — ${cat}`);
    const bodyLines = [
      `Nome: ${name}`,
      `Email: ${email}`,
      `Categoria: ${cat}`,
      `Prazo: ${deadline || 'N/A'}`,
      '',
      'Descrição do projeto:',
      desc,
      '',
      'Podes responder a este email. Se necessário, envio imagens anexas.'
    ];
    const body = encodeURIComponent(bodyLines.join('\n'));

    window.location.href = `mailto:effen3d_design@outlook.com?subject=${subject}&body=${body}`;
    close();
  });
})();
