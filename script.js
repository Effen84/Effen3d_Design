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
