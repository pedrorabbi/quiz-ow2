// Funções para drag and drop

let draggedElement = null;

export function setupDragAndDrop(element) {
  element.setAttribute('draggable', 'true');

  element.addEventListener('dragstart', (e) => {
    draggedElement = element;
    element.style.opacity = '0.5';
  });

  element.addEventListener('dragend', (e) => {
    element.style.opacity = '1';
    // Remover classes de feedback visual
    document.querySelectorAll('.drag-over-top, .drag-over-bottom').forEach(el => {
      el.classList.remove('drag-over-top', 'drag-over-bottom');
    });
  });

  element.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (draggedElement === element) return;

    // Calcular se está na metade superior ou inferior do elemento
    const rect = element.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const isTop = e.clientY < midpoint;

    // Remover classes anteriores
    element.classList.remove('drag-over-top', 'drag-over-bottom');

    // Adicionar classe apropriada
    if (isTop) {
      element.classList.add('drag-over-top');
    } else {
      element.classList.add('drag-over-bottom');
    }
  });

  element.addEventListener('dragleave', (e) => {
    element.classList.remove('drag-over-top', 'drag-over-bottom');
  });

  element.addEventListener('drop', (e) => {
    e.preventDefault();
    if (draggedElement === element) return;

    const rect = element.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const isTop = e.clientY < midpoint;

    const container = element.parentElement;

    if (isTop) {
      container.insertBefore(draggedElement, element);
    } else {
      container.insertBefore(draggedElement, element.nextSibling);
    }

    // Remover classes de feedback visual
    element.classList.remove('drag-over-top', 'drag-over-bottom');

    // Renumerar perguntas após o drop (se necessário)
    if (window.renumberQuestions) {
      window.renumberQuestions();
    }
  });
}

export function renumberQuestions(prefix = '') {
  const containerId = prefix ? `questionsContainer-${prefix}` : 'questionsContainer';
  const container = document.getElementById(containerId);
  if (!container) return;

  const questionBlocks = container.querySelectorAll('.question-block');
  const loaderBlocks = container.querySelectorAll('.loader-block');

  let questionNumber = 1;
  let loaderNumber = 1;

  // Renumerar todas as perguntas e loaders na ordem atual
  Array.from(container.children).forEach(block => {
    if (block.classList.contains('question-block')) {
      const numberLabel = block.querySelector('.question-number');
      if (numberLabel) {
        numberLabel.textContent = `Pergunta ${questionNumber}`;
        questionNumber++;
      }
    } else if (block.classList.contains('loader-block')) {
      const loaderLabel = block.querySelector('.loader-label');
      if (loaderLabel) {
        loaderLabel.textContent = `Loading Step ${loaderNumber}`;
        loaderNumber++;
      }
    }
  });
}
