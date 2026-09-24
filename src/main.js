const dialog = document.querySelector('#brief-dialog');
const form = document.querySelector('#brief-form');
const success = document.querySelector('#form-success');
const status = document.querySelector('#brief-status');
const copyStatus = document.querySelector('#copy-status');
let applicationMessage = '';

function openDialog() {
  form.hidden = false;
  success.hidden = true;
  dialog.showModal();
  requestAnimationFrame(() => form.elements.name.focus());
}

function closeDialog() {
  dialog.close();
}

async function copyApplication() {
  try {
    await navigator.clipboard.writeText(applicationMessage);
    copyStatus.textContent = 'Текст заявки скопирован.';
  } catch {
    copyStatus.textContent = 'Не удалось скопировать автоматически. Выберите Email, Telegram или WhatsApp.';
  }
}

function clearErrors() {
  form.querySelectorAll('.field-error').forEach((error) => error.remove());
  form.querySelectorAll('[aria-invalid]').forEach((field) => field.removeAttribute('aria-invalid'));
}

function showError(field, message) {
  field.setAttribute('aria-invalid', 'true');
  const error = document.createElement('span');
  error.className = 'field-error';
  error.textContent = message;
  field.closest('label').append(error);
}

document.querySelector('#brief-open').addEventListener('click', openDialog);
document.querySelector('#brief-close').addEventListener('click', closeDialog);
document.querySelector('#success-close').addEventListener('click', closeDialog);
document.querySelector('#copy-application').addEventListener('click', copyApplication);
document.querySelector('#send-max').addEventListener('click', () => { copyApplication(); });
dialog.addEventListener('click', (event) => { if (event.target === dialog) closeDialog(); });

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearErrors();

  const data = new FormData(form);
  const name = data.get('name').trim();
  const brief = data.get('brief').trim();
  let firstInvalidField = null;

  if (!name) { showError(form.elements.name, 'Напишите, как к вам обращаться'); firstInvalidField ??= form.elements.name; }
  if (!form.elements.consent.checked) { showError(form.elements.consent, 'Подтвердите согласие'); firstInvalidField ??= form.elements.consent; }

  if (firstInvalidField) {
    status.textContent = 'Проверьте отмеченные поля.';
    firstInvalidField.focus();
    return;
  }

  const application = {
    name,
    contactMethod: data.get('contactMethod'),
    siteType: data.get('siteType'),
    brief,
    createdAt: new Date().toISOString(),
  };

  applicationMessage = [
    'Новая заявка с сайта «web и точка.»',
    '',
    `Имя: ${application.name}`,
    `Способ связи: ${application.contactMethod}`,
    `Тип сайта: ${application.siteType}`,
    '',
    'Задача:',
    application.brief,
  ].join('\n');

  const encodedMessage = encodeURIComponent(applicationMessage);
  const encodedSubject = encodeURIComponent(`Заявка на сайт — ${application.name}`);
  document.querySelector('#send-email').href = `mailto:N.chernovol1010@yandex.ru?subject=${encodedSubject}&body=${encodedMessage}`;
  document.querySelector('#send-telegram').href = `https://t.me/chernovol_nv?text=${encodedMessage}`;
  document.querySelector('#send-whatsapp').href = `https://wa.me/79284647374?text=${encodedMessage}`;
  copyStatus.textContent = '';

  localStorage.setItem('web-i-tochka-draft', JSON.stringify(application));
  form.hidden = true;
  success.hidden = false;
  success.querySelector('button').focus();
});
