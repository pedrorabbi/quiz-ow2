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

// Inicializar histórico quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (window.loadQuizHistory) {
      window.loadQuizHistory();
    }
  }, 100);
});

console.log('OW Padrão - Módulos ES6 carregados');
