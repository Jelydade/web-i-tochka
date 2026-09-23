const dialog = document.querySelector('#brief-dialog');
document.querySelector('#brief-open').addEventListener('click', () => dialog.showModal());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
document.querySelector('#copy-brief').addEventListener('click', async () => {
  const field = document.querySelector('#brief');
  const status = document.querySelector('#brief-status');
  if (!field.value.trim()) { status.textContent = 'Сначала напишите несколько слов о вашей идее.'; field.focus(); return; }
  try { await navigator.clipboard.writeText(field.value.trim()); status.textContent = 'Описание скопировано. Можно сохранить его или отправить при обсуждении проекта.'; }
  catch { field.focus(); field.select(); status.textContent = 'Выделил описание — скопируйте его сочетанием Ctrl+C или ⌘C.'; }
});
