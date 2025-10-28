// Funções utilitárias

export function toEscapedVersion(html) {
  return html
    // Escapar aspas duplas em atributos e strings
    .replace(/"/g, '\\"')
    // Transformar regex de \w em \\w
    .replace(/\\w/g, '\\\\w')
    // Transformar aspas normais em entidades &#34 (sem ;)
    .replace(/\\"/g, '&#34');
}

export function clearForm(prefix = '') {
  const verticalId = prefix ? `vertical-${prefix}` : 'vertical';
  const domainId = prefix ? `domain-${prefix}` : 'domain';
  const titleId = prefix ? `title-${prefix}` : 'title';
  const containerIdId = prefix ? `questionsContainer-${prefix}` : 'questionsContainer';

  const verticalInput = document.getElementById(verticalId);
  const domainInput = document.getElementById(domainId);
  const titleInput = document.getElementById(titleId);
  const questionsContainer = document.getElementById(containerIdId);

  if (verticalInput) verticalInput.value = '';
  if (domainInput) domainInput.value = '';
  if (titleInput) titleInput.value = '';
  if (questionsContainer) questionsContainer.innerHTML = '';
}

export function showNotification(message, type = 'success') {
  // Criar elemento de notificação
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    background: ${type === 'success' ? '#22c55d' : '#ef4444'};
    color: white;
    font-weight: 500;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Remover após 3 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
