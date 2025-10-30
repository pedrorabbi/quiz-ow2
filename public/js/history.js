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

  // Limpar container antes de re-renderizar
  container.innerHTML = '';

  if (history.length === 0) {
    if (noHistoryEl) noHistoryEl.style.display = 'block';
    return;
  }

  if (noHistoryEl) noHistoryEl.style.display = 'none';

  history.forEach((quiz) => {
    // Contar perguntas e loaders
    const questionCount = (quiz.questions && Array.isArray(quiz.questions)) ? quiz.questions.length : 0;
    const loaderCount = (quiz.loaders && Array.isArray(quiz.loaders)) ? quiz.loaders.length : 0;

    // Formatar data
    const formattedDate = new Date(quiz.timestamp).toLocaleString('pt-BR');

    const historyItem = document.createElement('div');
    historyItem.style.cssText = `
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 12px;
      background: #f9f9f9;
      margin-bottom: 8px;
    `;

    // Header do item com informações básicas
    const headerDiv = document.createElement('div');
    headerDiv.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    `;

    const infoDiv = document.createElement('div');
    infoDiv.style.flex = '1';

    const titleDiv = document.createElement('div');
    titleDiv.style.cssText = 'font-weight: bold; font-size: 14px; color: #333; margin-bottom: 4px;';
    titleDiv.textContent = quiz.vertical || 'Quiz sem título';

    const detailsDiv = document.createElement('div');
    detailsDiv.style.cssText = 'font-size: 12px; color: #666;';

    if (prefix === 'long') {
      detailsDiv.textContent = `${formattedDate} • ${questionCount} perguntas`;
    } else {
      detailsDiv.textContent = `${formattedDate} • ${questionCount} perguntas • ${loaderCount} loaders`;
    }

    infoDiv.appendChild(titleDiv);
    infoDiv.appendChild(detailsDiv);

    // Container dos botões
    const buttonsDiv = document.createElement('div');
    buttonsDiv.style.cssText = 'display: flex; gap: 8px; align-items: center;';

    // Botão de expandir/colapsar
    const toggleButton = document.createElement('button');
    toggleButton.innerHTML = '<span class="material-symbols-rounded" style="font-size: 16px;">expand_more</span>';
    toggleButton.title = 'Expandir detalhes';
    toggleButton.style.cssText = `
      padding: 4px;
      background: transparent;
      color: #666;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
      width: fit-content;
      flex: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const duplicateButton = document.createElement('button');
    duplicateButton.innerHTML = '<span class="material-symbols-rounded" style="font-size: 16px;">content_copy</span>';
    duplicateButton.title = 'Duplicar quiz';
    duplicateButton.style.cssText = `
      padding: 4px;
      background: transparent;
      color: #22C55D;
      border: 1px solid #22C55D;
      border-radius: 4px;
      cursor: pointer;
      width: fit-content;
      flex: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<span class="material-symbols-rounded" style="font-size: 16px;">delete</span>';
    deleteButton.title = 'Excluir quiz do histórico';
    deleteButton.style.cssText = `
      padding: 4px;
      background: transparent;
      color: #EF4444;
      border: 1px solid #EF4444;
      border-radius: 4px;
      cursor: pointer;
      width: fit-content;
      flex: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    buttonsDiv.appendChild(toggleButton);
    buttonsDiv.appendChild(duplicateButton);
    buttonsDiv.appendChild(deleteButton);

    headerDiv.appendChild(infoDiv);
    headerDiv.appendChild(buttonsDiv);

    // Conteúdo expandível com detalhes dos steps
    const expandableDiv = document.createElement('div');
    expandableDiv.style.cssText = `
      display: none;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #e0e0e0;
    `;

    // Lista de steps (perguntas e loaders)
    if (quiz.questions && quiz.questions.length > 0) {
      const stepsTitle = document.createElement('div');
      stepsTitle.style.cssText = 'font-weight: bold; font-size: 12px; color: #666; margin-bottom: 8px; text-transform: uppercase;';
      stepsTitle.textContent = 'Perguntas:';
      expandableDiv.appendChild(stepsTitle);

      quiz.questions.forEach((question, qIndex) => {
        const stepDiv = document.createElement('div');
        stepDiv.style.cssText = `
          padding: 8px;
          margin: 4px 0;
          border-radius: 4px;
          font-size: 12px;
          background: #f0f9ff;
          border-left: 3px solid #0ea5e9;
        `;

        stepDiv.innerHTML = `
          <div style="font-weight: bold; color: #0ea5e9; margin-bottom: 4px;">
            📝 Pergunta ${qIndex + 1}
          </div>
          <div style="color: #333; margin-bottom: 4px;">${question.q}</div>
          <div style="color: #666; font-size: 11px;">
            Opções: ${question.opts.join(' • ')}
          </div>
        `;
        expandableDiv.appendChild(stepDiv);
      });
    }

    // Mostrar configurações
    const configTitle = document.createElement('div');
    configTitle.style.cssText = 'font-weight: bold; font-size: 12px; color: #666; margin: 12px 0 8px 0; text-transform: uppercase;';
    configTitle.textContent = 'Configurações:';
    expandableDiv.appendChild(configTitle);

    const configDiv = document.createElement('div');
    configDiv.style.cssText = 'font-size: 12px; color: #666; line-height: 1.4;';

    if (prefix === 'long') {
      configDiv.innerHTML = `
        <div><strong>Vertical:</strong> ${quiz.vertical || 'Não definido'}</div>
        <div><strong>Domínio:</strong> ${quiz.domain || 'Não definido'}</div>
        <div><strong>Texto Loading:</strong> ${quiz.loadingText || 'Não definido'}</div>
        <div><strong>Texto Final:</strong> ${quiz.awardText || 'Não definido'}</div>
        <div><strong>Botão:</strong> ${quiz.buttonText || 'Não definido'}</div>
        <div><strong>Cores:</strong>
          <span style="display: inline-block; width: 12px; height: 12px; background: ${quiz.primaryColor}; border: 1px solid #ccc; border-radius: 2px; margin: 0 2px;"></span>
          <span style="display: inline-block; width: 12px; height: 12px; background: ${quiz.primaryHover}; border: 1px solid #ccc; border-radius: 2px; margin: 0 2px;"></span>
        </div>
      `;
    } else {
      configDiv.innerHTML = `
        <div><strong>Vertical:</strong> ${quiz.vertical || 'Não definido'}</div>
        <div><strong>Domínio:</strong> ${quiz.domain || 'Não definido'}</div>
        <div><strong>Com retenção:</strong> ${quiz.withRetention ? 'Sim' : 'Não'}</div>
        <div><strong>Botão final:</strong> ${quiz.buttonText || 'Não definido'}</div>
        <div><strong>Rodapé:</strong> ${quiz.footnote || 'Não definido'}</div>
        <div><strong>Cores:</strong>
          <span style="display: inline-block; width: 12px; height: 12px; background: ${quiz.primaryColor}; border: 1px solid #ccc; border-radius: 2px; margin: 0 2px;"></span>
          <span style="display: inline-block; width: 12px; height: 12px; background: ${quiz.secondaryColor}; border: 1px solid #ccc; border-radius: 2px; margin: 0 2px;"></span>
          <span style="display: inline-block; width: 12px; height: 12px; background: ${quiz.hoverColor}; border: 1px solid #ccc; border-radius: 2px; margin: 0 2px;"></span>
        </div>
      `;
    }
    expandableDiv.appendChild(configDiv);

    // Eventos de toggle
    let isExpanded = false;
    const toggleExpand = () => {
      isExpanded = !isExpanded;
      if (isExpanded) {
        expandableDiv.style.display = 'block';
        toggleButton.innerHTML = '<span class="material-symbols-rounded" style="font-size: 16px;">expand_less</span>';
        toggleButton.title = 'Recolher detalhes';
      } else {
        expandableDiv.style.display = 'none';
        toggleButton.innerHTML = '<span class="material-symbols-rounded" style="font-size: 16px;">expand_more</span>';
        toggleButton.title = 'Expandir detalhes';
      }
    };

    toggleButton.onclick = (e) => {
      e.stopPropagation();
      toggleExpand();
    };

    headerDiv.onclick = (e) => {
      // Só expandir se não clicou nos botões
      if (!e.target.closest('button')) {
        toggleExpand();
      }
    };

    duplicateButton.onclick = (e) => {
      e.stopPropagation();
      window.duplicateQuizFromHistory(quiz.id, prefix);
    };

    deleteButton.onclick = (e) => {
      e.stopPropagation();
      if (confirm('Tem certeza que deseja excluir este quiz do histórico?')) {
        deleteQuizFromHistory(quiz.id, prefix);
        renderQuizHistory(containerId, onDuplicate, onDelete, prefix);
      }
    };

    historyItem.appendChild(headerDiv);
    historyItem.appendChild(expandableDiv);
    container.appendChild(historyItem);
  });
}
