const dialog = document.querySelector('#brief-dialog');
const form = document.querySelector('#brief-form');
const success = document.querySelector('#form-success');
const status = document.querySelector('#brief-status');

function openDialog() {
  form.hidden = false;
  success.hidden = true;
  dialog.showModal();
  requestAnimationFrame(() => form.elements.name.focus());
}

function closeDialog() {
  dialog.close();
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
dialog.addEventListener('click', (event) => { if (event.target === dialog) closeDialog(); });

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearErrors();

  const data = new FormData(form);
  const name = data.get('name').trim();
  const contact = data.get('contact').trim();
  const brief = data.get('brief').trim();
  let firstInvalidField = null;

  if (!name) { showError(form.elements.name, 'Напишите, как к вам обращаться'); firstInvalidField ??= form.elements.name; }
  if (!contact) { showError(form.elements.contact, 'Укажите удобный способ связи'); firstInvalidField ??= form.elements.contact; }
  if (brief.length < 15) { showError(form.elements.brief, 'Расскажите о задаче хотя бы в нескольких словах'); firstInvalidField ??= form.elements.brief; }
  if (!form.elements.consent.checked) { showError(form.elements.consent, 'Подтвердите согласие'); firstInvalidField ??= form.elements.consent; }

  if (firstInvalidField) {
    status.textContent = 'Проверьте отмеченные поля.';
    firstInvalidField.focus();
    return;
  }

  const application = {
    name,
    contact,
    siteType: data.get('siteType'),
    budget: data.get('budget'),
    brief,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem('web-i-tochka-draft', JSON.stringify(application));
  form.hidden = true;
  success.hidden = false;
  success.querySelector('button').focus();
});
