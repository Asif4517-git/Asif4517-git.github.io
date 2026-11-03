/* Real-photo viewer. Native dialog keeps photos keyboard-accessible and
   above the custom cursor; images only load when requested. */
(() => {
  const viewer = document.getElementById('imageDialog');
  const image = document.getElementById('fullImage');
  const caption = document.getElementById('fullCaption');
  if (!viewer || !image) return;
  let opener;
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-photo]');
    if (!button) return;
    opener = button;
    image.src = button.dataset.photo;
    image.alt = button.querySelector('img')?.alt || 'Project photograph';
    caption.textContent = image.alt;
    viewer.showModal();
    document.body.classList.add('menu-open', 'dialog-open');
    viewer.querySelector('button').focus();
  });
  viewer.querySelector('.image-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', (event) => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('menu-open', 'dialog-open');
    opener?.focus();
    image.removeAttribute('src');
  });
})();
