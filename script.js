// Header: mudar fundo ao scroll
document.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (!header) return;
  header.style.background = window.scrollY > 50 ? '#000' : 'rgba(0,0,0,0.9)';
});

// --- Lightbox ---
(function () {
  const images = document.querySelectorAll('.gallery img');
  const container = document.getElementById('lightbox');
  const imgTarget = document.getElementById('lightbox-img');
  const closeBtn = container ? container.querySelector('.close') : null;

  if (!container || !imgTarget || images.length === 0) return;

  images.forEach(img => {
    img.addEventListener('click', () => {
      container.classList.add('open');
      imgTarget.src = img.getAttribute('src');
      imgTarget.alt = img.getAttribute('alt') || '';
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLB() {
    container.classList.remove('open');
    document.body.style.overflow = '';
  }
  closeBtn && closeBtn.addEventListener('click', closeLB);
  container.addEventListener('click', e => { if (e.target === container) closeLB(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && container.classList.contains('open')) closeLB(); });
})();

// --- Orçamento (modal + mailto) ---
(function(){
  const openers = [document.getElementById('openQuote'), document.getElementById('openQuote2')].filter(Boolean);
  const backdrop = document.getElementById('quoteBackdrop');
  const closeBtn = document.getElementById('closeQuote');
  const form = document.getElementById('quoteForm');

  if (!backdrop) return;

  const open = (e) => { e && e.preventDefault(); backdrop.classList.add('open'); document.body.style.overflow='hidden'; };
  const close = () => { backdrop.classList.remove('open'); document.body.style.overflow=''; };

  openers.forEach(btn => btn.addEventListener('click', open));
  closeBtn && closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e)=>{ if(e.target === backdrop) close(); });

  form && form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('qName').value.trim();
    const email = document.getElementById('qEmail').value.trim();
    const cat = document.getElementById('qCategory').value;
    const desc = document.getElementById('qDesc').value.trim();
    const deadline = document.getElementById('qDeadline').value.trim();

    if(!name || !email || !desc){ alert('Preenche Nome, Email e Descrição.'); return; }

    const subject = encodeURIComponent(`Pedido de orçamento — ${cat}`);
    const body = encodeURIComponent(
      `Nome: ${name}\nEmail: ${email}\nCategoria: ${cat}\nPrazo: ${deadline || 'N/A'}\n\nDescrição do projeto:\n${desc}\n\n(Podes responder a este email. Se necessário, envio imagens anexas.)`
    );

    window.location.href = `mailto:effen3d_design@outlook.com?subject=${subject}&body=${body}`;
    close();
  });
})();
