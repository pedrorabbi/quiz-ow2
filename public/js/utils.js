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

export function showQuizPreviewModal(quizUrl, quizHtml) {
  // Criar modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.style.zIndex = '10001';

  // Criar conteúdo do modal
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.style.maxWidth = '90%';
  modalContent.style.width = '800px';
  modalContent.style.maxHeight = '90vh';

  modalContent.innerHTML = `
    <div class="modal-header">
      <span class="success-icon">✓</span>
      <h2>Quiz criado com sucesso!</h2>
    </div>

    <div class="modal-body">
      <div style="margin-top: 20px;">
        <p style="margin-bottom: 10px; font-weight: 600; color: #1f2937;">Preview do Quiz:</p>
        <div style="border: 2px solid #e5e7eb; border-radius: 8px; overflow: hidden; background: #f9fafb;">
          <iframe
            srcdoc="${quizHtml.replace(/"/g, '&quot;')}"
            style="width: 100%; height: 500px; border: none; display: block;"
            sandbox="allow-scripts allow-same-origin"
          ></iframe>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button class="close-button" onclick="this.closest('.modal-overlay').remove()">Fechar</button>
    </div>
  `;

  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  // Fechar modal ao clicar no overlay
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.remove();
    }
  });
}
