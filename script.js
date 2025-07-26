// Função principal do cálculo
function calcular() {
  const taxas = [
    0.0353,
    0.0451,
    0.0532,
    0.0610,
    0.0687,
    0.0764,
    0.0836,
    0.0909,
    0.0984,
    0.1060,
    0.1138,
    0.1216
  ];

  function arredondarPraCima5(num) {
    return (num % 5 === 0) ? num: Math.ceil(num / 5) * 5;
  }

  const valorBruto = Number(document.getElementById('valor_bruto').value);

  if (!valorBruto || valorBruto <= 0) {
    alert('Digite um valor bruto válido!');
    return;
  }

  const tbody = document.getElementById('tabela_resultado');
  tbody.innerHTML = '';

  for (let i = 0; i < taxas.length; i++) {
    const parcela = i + 1;
    const taxa = taxas[i];

    const valorTotalBruto = valorBruto / (1 - taxa);
    const valorTotal = arredondarPraCima5(valorTotalBruto);
    const valorParcela = valorTotal / parcela;

    const tr = document.createElement('tr');
    tr.innerHTML = `
    <td>${parcela}x</td>
    <td>R$ ${valorParcela.toFixed(2).replace('.', ',')}</td>
    <td>R$ ${valorTotal.toFixed(2).replace('.', ',')}</td>
    `;

    tbody.appendChild(tr);
  }
}

// Clique no botão
document.querySelector('button').addEventListener('click', calcular);

// Pressionar Enter no input
document.getElementById('valor_bruto').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    calcular();
  }
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
  .then(() => console.log('Service Worker registrado'))
  .catch(err => console.log('Erro ao registrar SW:', err));
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Exibir botão ou banner de "Instalar"
  const btn = document.createElement('button');
  btn.textContent = 'Instalar app';
  btn.style.position = 'fixed';
  btn.style.bottom = '20px';
  btn.style.right = '20px';
  btn.style.padding = '10px 15px';
  btn.style.background = '#1a73e8';
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.borderRadius = '8px';
  btn.style.cursor = 'pointer';
  document.body.appendChild(btn);

  btn.addEventListener('click', () => {
    btn.remove();
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => deferredPrompt = null);
  });
});