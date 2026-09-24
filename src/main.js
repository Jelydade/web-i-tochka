const dialog = document.querySelector('#contact-dialog');
const form = document.querySelector('#contact-form');
const method = document.querySelector('#contact-method');
const promoForms = document.querySelectorAll('[data-promo-form]');
const promoConfig = window.PROMO_CONFIG || { endpoint: '', anonKey: '' };
let appliedPromo = null;

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

function formatRubles(amount) {
  return `${new Intl.NumberFormat('ru-RU').format(amount)} ₽`;
}

function setPromoDiscount(promo) {
  document.querySelectorAll('[data-base-price]').forEach((price) => {
    const basePrice = Number(price.dataset.basePrice);
    const original = price.querySelector('[data-price-original]');
    const discounted = price.querySelector('[data-price-discount]');
    if (promo) {
      original.classList.add('is-discounted');
      discounted.textContent = formatRubles(Math.round(basePrice * (1 - promo.discountPercent / 100)));
      discounted.hidden = false;
    } else {
      original.classList.remove('is-discounted');
      discounted.hidden = true;
    }
  });

  document.querySelectorAll('[data-extra-page-price]').forEach((price) => {
    const basePrice = Number(price.dataset.extraPagePrice);
    const discounted = price.parentElement.querySelector('[data-extra-page-discount]');
    if (promo) {
      price.classList.add('is-discounted');
      discounted.textContent = `+${formatRubles(Math.round(basePrice * (1 - promo.discountPercent / 100)))}`;
      discounted.hidden = false;
    } else {
      price.classList.remove('is-discounted');
      discounted.hidden = true;
    }
  });
}

function activePromo() {
  return appliedPromo;
}

function showPromo(promo) {
  const expiresAt = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'long' }).format(new Date(promo.expiresAt));
  promoForms.forEach((promoForm) => {
    promoForm.querySelector('[data-promo-code]').value = promo.code;
    const promoStatus = promoForm.querySelector('[data-promo-status]');
    promoStatus.textContent = `Скидка ${promo.discountPercent}% применена до ${expiresAt}.`;
    promoStatus.classList.remove('is-error');
    promoForm.querySelector('[data-promo-reset]').hidden = false;
    promoForm.querySelector('.promo-submit').classList.remove('is-error');
    promoForm.querySelector('.promo-submit').classList.add('is-clicked');
  });
  setPromoDiscount(promo);
}

function clearPromo() {
  appliedPromo = null;
  promoForms.forEach((promoForm) => {
    promoForm.querySelector('[data-promo-code]').value = '';
    const promoStatus = promoForm.querySelector('[data-promo-status]');
    promoStatus.textContent = '';
    promoStatus.classList.remove('is-error');
    promoForm.querySelector('[data-promo-reset]').hidden = true;
    promoForm.querySelector('.promo-submit').classList.remove('is-clicked', 'is-error');
  });
  setPromoDiscount(null);
}

document.querySelector('#contact-open').addEventListener('click', openDialog);
document.querySelector('#contact-close').addEventListener('click', closeDialog);
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) closeDialog();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const promo = activePromo();
  const message = promo ? `Здравствуйте! Хочу обсудить сайт. Промокод: ${promo.code} (скидка ${promo.discountPercent}%).` : '';
  const destination = destinations[method.value];

  if (!message || method.value === 'phone' || method.value === 'max') {
    window.location.href = destination;
    return;
  }

  if (method.value === 'email') {
    window.location.href = `${destination}?subject=${encodeURIComponent('Заявка на сайт')}&body=${encodeURIComponent(message)}`;
    return;
  }

  window.location.href = `${destination}?text=${encodeURIComponent(message)}`;
});

promoForms.forEach((promoForm) => {
  const promoCode = promoForm.querySelector('[data-promo-code]');
  const promoStatus = promoForm.querySelector('[data-promo-status]');
  const promoReset = promoForm.querySelector('[data-promo-reset]');

  promoCode.addEventListener('input', () => {
    promoCode.value = promoCode.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
    promoForm.querySelector('.promo-submit').classList.remove('is-clicked', 'is-error');
  });

  promoForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    promoForm.querySelector('.promo-submit').classList.add('is-clicked');
    const code = promoCode.value.trim();

    if (!/^[A-Z0-9]{5}$/.test(code)) {
      promoStatus.textContent = 'Введите код из 5 латинских букв и цифр.';
      promoStatus.classList.add('is-error');
      promoForm.querySelector('.promo-submit').classList.add('is-error');
      return;
    }

    if (!promoConfig.endpoint || !promoConfig.anonKey) {
      promoStatus.textContent = 'Проверка промокодов скоро будет подключена.';
      promoStatus.classList.add('is-error');
      promoForm.querySelector('.promo-submit').classList.add('is-error');
      return;
    }

    promoStatus.textContent = 'Проверяем промокод…';
    promoStatus.classList.remove('is-error');

    try {
      const response = await fetch(promoConfig.endpoint, {
        method: 'POST',
        headers: {
          apikey: promoConfig.anonKey,
          Authorization: `Bearer ${promoConfig.anonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      const result = await response.json();

      if (!response.ok || !result.valid) {
        throw new Error(result.message || 'Промокод не найден или больше не действует.');
      }

      const promo = {
        code: result.code,
        discountPercent: result.discountPercent,
        expiresAt: result.expiresAt,
      };
      appliedPromo = promo;
      showPromo(promo);
    } catch (error) {
      promoStatus.textContent = error.message || 'Не удалось проверить промокод. Попробуйте ещё раз.';
      promoStatus.classList.add('is-error');
      promoForm.querySelector('.promo-submit').classList.add('is-error');
    }
  });

  promoReset.addEventListener('click', clearPromo);
});

clearPromo();

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
