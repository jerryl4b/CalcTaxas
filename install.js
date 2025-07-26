let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const btn = document.createElement('button');
  btn.textContent = 'Instalar App';
  btn.style.position = 'fixed';
  btn.style.bottom = '20px';
  btn.style.right = '20px';
  btn.style.padding = '10px 15px';
  btn.style.background = '#007bff';
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.borderRadius = '8px';
  btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  btn.style.cursor = 'pointer';
  document.body.appendChild(btn);

  btn.addEventListener('click', async () => {
    btn.remove();
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    deferredPrompt = null;
  });
});