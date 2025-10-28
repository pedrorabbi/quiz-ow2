// Funções para gerenciar histórico de quizzes

const STORAGE_KEY = 'quizHistory';
const MAX_HISTORY_ITEMS = 10;

export function saveQuizToHistory(quizData, prefix = '') {
  try {
    const storageKey = prefix ? `${STORAGE_KEY}-${prefix}` : STORAGE_KEY;
    const history = getQuizHistory(prefix);

    const newEntry = {
      ...quizData,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };

    // Adicionar no início do array
    history.unshift(newEntry);

    // Limitar ao máximo de itens
    if (history.length > MAX_HISTORY_ITEMS) {
      history.splice(MAX_HISTORY_ITEMS);
    }

    localStorage.setItem(storageKey, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Erro ao salvar quiz no histórico:', error);
    return false;
  }
}

export function getQuizHistory(prefix = '') {
  try {
    const storageKey = prefix ? `${STORAGE_KEY}-${prefix}` : STORAGE_KEY;
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    return [];
  }
}

export function deleteQuizFromHistory(id, prefix = '') {
  try {
    const storageKey = prefix ? `${STORAGE_KEY}-${prefix}` : STORAGE_KEY;
    const history = getQuizHistory(prefix);
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Erro ao deletar quiz do histórico:', error);
    return false;
  }
}

export function renderQuizHistory(containerId, onDuplicate, onDelete, prefix = '') {
  const history = getQuizHistory(prefix);
  const container = document.getElementById(containerId);
  const noHistoryEl = document.getElementById(prefix ? `noHistory-${prefix}` : 'noHistory');

  if (!container) return;

  if (history.length === 0) {
    container.innerHTML = '';
    if (noHistoryEl) noHistoryEl.style.display = 'block';
    return;
  }

  if (noHistoryEl) noHistoryEl.style.display = 'none';

  container.innerHTML = history.map(quiz => `
    <div style="border: 1px solid #ddd; border-radius: 8px; padding: 12px; background: #fafafa;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
        <div style="flex: 1;">
          <div style="font-weight: 600; color: #333; margin-bottom: 4px;">${quiz.vertical || 'Sem título'}</div>
          <div style="font-size: 12px; color: #666;">${quiz.domain || ''}</div>
          <div style="font-size: 11px; color: #999; margin-top: 4px;">
            ${new Date(quiz.timestamp).toLocaleString('pt-BR')}
          </div>
        </div>
      </div>
      ${quiz.url ? `
        <a href="${quiz.url}" target="_blank" style="font-size: 12px; color: #2563eb; word-break: break-all; display: block; margin-bottom: 8px;">
          ${quiz.url}
        </a>
      ` : ''}
      <div style="display: flex; gap: 8px; margin-top: 8px;">
        <button onclick="window.duplicateQuizFromHistory(${quiz.id}, '${prefix}')" style="flex: 1; padding: 6px 12px; font-size: 12px; background: #2563eb;">
          Duplicar
        </button>
        <button onclick="window.deleteQuizFromHistory(${quiz.id}, '${prefix}')" style="padding: 6px 12px; font-size: 12px; background: #ef4444;">
          Excluir
        </button>
      </div>
    </div>
  `).join('');
}
