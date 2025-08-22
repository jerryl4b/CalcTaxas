// Service Worker (PWA) - Mantido igual
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .then(() => console.log('Service Worker registrado'))
    .catch(err => console.log('Erro ao registrar SW:', err));
}

// Cache de elementos DOM
const elements = {
  valorBruto: document.getElementById('valor_bruto'),
  tabelaResultado: document.getElementById('tabela_resultado'),
  teclado: document.querySelectorAll("#teclado_num .tecla")
};

// Taxas pré-definidas
const taxas = [
  0.0353, 0.0451, 0.0532, 0.0610, 0.0687,
  0.0764, 0.0836, 0.0909, 0.0984, 0.1060,
  0.1138, 0.1216
];

// Formatador monetário
const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

// Função de arredondamento corrigida
function arredondarPraCima5(valor) {
  return Math.ceil(valor / 5) * 5; // Arredonda para múltiplos de 0.05
}

// Função principal do cálculo otimizada
function calcular() {
  const valorNumerico = parseFloat(elements.valorBruto.value.replace(',', '.'));
  
  // Limpa resultados se valor inválido
  if (isNaN(valorNumerico)) {
    elements.tabelaResultado.innerHTML = '';
    return;
  }

  let htmlContent = '';
  
  taxas.forEach((taxa, index) => {
    const parcela = index + 1;
    const valorTotalBruto = valorNumerico / (1 - taxa);
    const valorTotal = arredondarPraCima5(valorTotalBruto);
    const valorParcela = valorTotal / parcela;

    htmlContent += `
      <tr>
        <td>${parcela}x</td>
        <td>${formatter.format(valorParcela)}</td>
        <td>${formatter.format(valorTotal)}</td>
      </tr>
    `;
  });

  elements.tabelaResultado.innerHTML = htmlContent;
}

// Debounce para otimização
let debounceTimer;
function debounceCalcular() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(calcular, 100);
}

// Configuração do teclado numérico
elements.teclado.forEach(btn => {
  btn.addEventListener("click", () => {
    const valor = btn.textContent;
    
    if (valor === "C") {
      elements.valorBruto.value = "";
      elements.tabelaResultado.innerHTML = "";
      return;
    }
    
    if (valor === ".") {
      if (!elements.valorBruto.value.includes(".")) {
        elements.valorBruto.value += elements.valorBruto.value ? "." : "0.";
      }
      return;
    }
    
    // Limita o tamanho máximo
    if (elements.valorBruto.value.length < 10) {
      elements.valorBruto.value += valor;
      debounceCalcular();
    }
  });
});

// Validação de entrada
elements.valorBruto.addEventListener('input', function() {
  // Permite apenas números e um único ponto decimal
  this.value = this.value
    .replace(/[^\d.,]/g, '')
    .replace(/(\..*)\./g, '$1')
    .replace(/,/g, '.');
  
  debounceCalcular();
});

// Suporte a tecla Enter
elements.valorBruto.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    calcular();
  }
});

// Foco automático no carregamento
window.addEventListener('DOMContentLoaded', () => {
  elements.valorBruto.focus();
});
// Verifica atualizações a cada carregamento
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      // Verifica atualizações periodicamente
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // Checa a cada hora

      // Ouvinte para nova versão disponível
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (confirm('Nova versão disponível! Deseja atualizar agora?')) {
              // Envia mensagem para o Service Worker atualizar
              newWorker.postMessage({action: 'checkForUpdate'});
            }
          }
        });
      });
    });
  
  // Dispara imediatamente quando o app ganha foco
  window.addEventListener('focus', () => {
    navigator.serviceWorker.getRegistration()
      .then(registration => registration?.update());
  });
}