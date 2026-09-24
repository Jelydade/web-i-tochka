const dialog = document.querySelector('#contact-dialog');
const form = document.querySelector('#contact-form');
const method = document.querySelector('#contact-method');

const destinations = {
  telegram: 'https://t.me/chernovol_nv',
  whatsapp: 'https://wa.me/79284647374',
  email: 'mailto:N.chernovol1010@yandex.ru',
  max: 'https://max.ru/u/f9LHodD0cOIJakOmkmETSt2GN6HAnkfo0p6yajNODiDJUWj-zJ4P6Ed-5JU',
  phone: 'tel:+79284647374',
};

function openDialog() {
  dialog.showModal();
  requestAnimationFrame(() => method.focus());
}

function closeDialog() {
  dialog.close();
}

document.querySelector('#contact-open').addEventListener('click', openDialog);
document.querySelector('#contact-close').addEventListener('click', closeDialog);
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) closeDialog();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  window.location.href = destinations[method.value];
});

const previews = document.querySelectorAll('[data-project-preview]');

previews.forEach((preview) => {
  const showPreview = () => {
    previews.forEach((item) => {
      const isSelected = item === preview;
      item.classList.toggle('is-front', isSelected);
      item.setAttribute('aria-pressed', String(isSelected));
    });
  };

  preview.addEventListener('click', showPreview);
  preview.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      showPreview();
    }
  });
});
