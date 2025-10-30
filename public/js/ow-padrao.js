// OW Padrão - Main Script (ES6 Modules)
import { toEscapedVersion, showNotification } from './utils.js';
import { uploadImage } from './upload.js';
import { createQuizLink, sendWebhook } from './api.js';
import { saveQuizToHistory, getQuizHistory, deleteQuizFromHistory, renderQuizHistory } from './history.js';
import { setupDragAndDrop, renumberQuestions } from './dragdrop.js';

// Importar o script.js original como fallback temporário
// Depois vamos migrar toda a funcionalidade para módulos
const script = document.createElement('script');
script.src = './script.js';
document.head.appendChild(script);

// Expor funções globalmente para compatibilidade com onclick
window.toEscapedVersion = toEscapedVersion;
window.uploadImage = uploadImage;
window.createQuizLink = createQuizLink;
window.saveQuizToHistory = saveQuizToHistory;
window.getQuizHistory = getQuizHistory;
window.setupDragAndDrop = setupDragAndDrop;
window.renumberQuestions = renumberQuestions;
window.showNotification = showNotification;

// Funções para o histórico (expor globalmente)
window.duplicateQuizFromHistory = function(id, prefix = '') {
  const history = getQuizHistory(prefix);
  const quiz = history.find(item => item.id === id);
  if (quiz && window.duplicateQuiz) {
    window.duplicateQuiz(quiz);
  }
};

window.deleteQuizFromHistory = function(id, prefix = '') {
  if (confirm('Tem certeza que deseja excluir este quiz do histórico?')) {
    deleteQuizFromHistory(id, prefix);
    const historyListId = prefix ? `historyList-${prefix}` : 'historyList';
    renderQuizHistory(historyListId, window.duplicateQuizFromHistory, window.deleteQuizFromHistory, prefix);
  }
};

// Função para controlar exibição dos campos de retenção
function toggleRetentionFields() {
  const withRetention = document.getElementById("withRetention")?.checked;
  const retentionFields = document.getElementById("retentionFields");
  const previewNameContainer = document.getElementById("previewNameInputContainer");
  const previewEmailContainer = document.getElementById("previewEmailInputContainer");

  if (retentionFields) {
    if (withRetention) {
      retentionFields.style.display = "flex";
      // Mostrar campos no preview
      if (previewNameContainer) previewNameContainer.style.display = "flex";
      if (previewEmailContainer) previewEmailContainer.style.display = "flex";
    } else {
      retentionFields.style.display = "none";
      // Esconder campos no preview
      if (previewNameContainer) previewNameContainer.style.display = "none";
      if (previewEmailContainer) previewEmailContainer.style.display = "none";
    }

    // Atualizar preview se a função existir
    if (window.updatePreview) {
      window.updatePreview();
    }
  }
}

// Expor função globalmente
window.toggleRetentionFields = toggleRetentionFields;

// Inicializar histórico e listeners quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  // Adicionar listener para o checkbox de retenção
  const withRetentionCheckbox = document.getElementById("withRetention");
  if (withRetentionCheckbox) {
    withRetentionCheckbox.addEventListener("change", toggleRetentionFields);
    // Inicializar estado
    toggleRetentionFields();
  }

  // Carregar histórico após um delay para garantir que script.js foi carregado
  setTimeout(() => {
    if (window.loadQuizHistory) {
      window.loadQuizHistory();
    }
  }, 100);
});

console.log('OW Padrão - Módulos ES6 carregados');
