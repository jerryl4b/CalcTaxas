// Service Worker (PWA)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .then(() => console.log('Service Worker registrado'))
    .catch(err => console.log('Erro ao registrar SW:', err));
}

// Função principal do cálculo
function calcular() {
  const taxas = [
    0.0353, 0.0451, 0.0532, 0.0610, 0.0687,
    0.0764, 0.0836, 0.0909, 0.0984, 0.1060,
    0.1138, 0.1216
  ];

  const valorBruto = parseFloat(document.getElementById('valor_bruto').value.replace(',', '.'));

  if (isNaN(valorBruto)) {
    alert('Digite um valor válido!');
    return;
  }

  const tbody = document.getElementById('tabela_resultado');
  tbody.innerHTML = '';

  function arredondarPraCima5(num) {
    return (num % 5 === 0) ? num : Math.ceil(num / 5) * 5;
  }

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

// Configurando o teclado numérico estático
const teclas = document.querySelectorAll("#teclado_num .tecla");

teclas.forEach(btn => {
  btn.addEventListener("click", () => {
    const input = document.getElementById('valor_bruto');
    const valor = btn.textContent;

    if (valor === "C") {
      input.value = ""; // limpa tudo
      document.getElementById('tabela_resultado').innerHTML=""
    } 
    else if (valor === ".") {
      if (!input.value.includes(".")) {
        input.value += input.value === "" ? "0." : ".";
      }
    } 
    else {
      input.value += valor;
      calcular()
    }
  });
});

// Botão de calcular
document.getElementById('valor_bruto').addEventListener('input', calcular);

// Pressionar Enter no input
document.getElementById('valor_bruto').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    calcular();
  }
});