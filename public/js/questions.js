// Módulo para gerenciar perguntas e opções (compartilhado entre OW Padrão e OW Long)
import { setupDragAndDrop, renumberQuestions } from './dragdrop.js';
import { uploadImage } from './upload.js';

// Adicionar pergunta genérica
export function addQuestion(config = {}) {
  const {
    containerId = 'questionsContainer',
    questionClass = 'question-input',
    optionClass = 'option-input',
    prefix = '',
    onUpdate = () => {},
    withImageUpload = false
  } = config;

  const container = document.getElementById(containerId);
  const index = container.children.length;

  const questionBlock = document.createElement('div');
  questionBlock.className = 'question-block';
  questionBlock.draggable = true;

  // Template base
  let imageUploadHTML = '';
  if (withImageUpload) {
    imageUploadHTML = `
      <div class="image-upload-container">
        <label class="image-upload-label">Imagem da pergunta (opcional):</label>
        <input type="file" class="image-input" accept="image/*" />
        <div class="image-upload-btn">
          <span class="material-symbols-rounded upload-icon">cloud_upload</span>
          <span class="upload-text">Escolher imagem</span>
        </div>
        <div class="image-preview" style="display: none;">
          <img class="preview-img" alt="Preview da imagem" />
          <button type="button" class="remove-image-btn">×</button>
        </div>
      </div>
    `;
  }

  const funcName = prefix ? `removeQuestion${prefix}` : 'removeQuestion';
  const addOptionFuncName = prefix ? `addOption${prefix}` : 'addOption';

  questionBlock.innerHTML = `
    <div class="drag-handle">≡≡</div>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div class="question-number">Pergunta ${index + 1}</div>
      <button type="button" onclick="${funcName}(this)" style="background: transparent; color: #ef4444; border: 1px solid #ef4444; border-radius: 4px; padding: 4px; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex: 0; width: fit-content;" title="Excluir pergunta">
        <span class="material-symbols-rounded" style="font-size: 16px;">delete</span>
      </button>
    </div>
    <div class="floating-label-group">
      <input type="text" placeholder=" " class="${questionClass}" />
      <label>Texto da Pergunta</label>
    </div>
    ${imageUploadHTML}
    <div class="options-container">
      <div class="floating-label-group">
        <input type="text" placeholder=" " class="${optionClass}" />
        <label>Opção 1</label>
      </div>
      <div class="floating-label-group">
        <input type="text" placeholder=" " class="${optionClass}" />
        <label>Opção 2</label>
      </div>
    </div>
    <button type="button" onclick="${addOptionFuncName}(this)">Adicionar Opção</button>
  `;

  container.appendChild(questionBlock);

  // Adicionar event listeners aos inputs
  const inputs = questionBlock.querySelectorAll('input:not(.image-input)');
  inputs.forEach(input => {
    input.addEventListener('input', onUpdate);
  });

  // Se tem upload de imagem, configurar
  if (withImageUpload) {
    const imageInput = questionBlock.querySelector('.image-input');
    const imageUploadBtn = questionBlock.querySelector('.image-upload-btn');
    const uploadText = questionBlock.querySelector('.upload-text');
    const imagePreview = questionBlock.querySelector('.image-preview');
    const previewImg = questionBlock.querySelector('.preview-img');
    const removeBtn = questionBlock.querySelector('.remove-image-btn');

    imageUploadBtn.addEventListener('click', () => {
      imageInput.click();
    });

    imageInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        await uploadImage(file, imageInput, imagePreview, previewImg, imageUploadBtn, uploadText);
        onUpdate();
      }
    });

    removeBtn.addEventListener('click', () => {
      imageInput.value = '';
      imageInput.removeAttribute('data-image-url');
      imagePreview.style.display = 'none';
      uploadText.textContent = 'Escolher imagem';
      imageUploadBtn.classList.remove('has-image');
      onUpdate();
    });
  }

  // Adicionar drag and drop
  setupDragAndDrop(questionBlock);

  onUpdate();
}

// Adicionar opção (já unificada)
export function addOption(button, optionClass = 'option-input', onUpdate = () => {}) {
  const optionsContainer = button.previousElementSibling;
  const optionCount = optionsContainer.querySelectorAll('.floating-label-group').length + 1;

  const wrapper = document.createElement('div');
  wrapper.className = 'floating-label-group';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = ' ';
  input.classList.add(optionClass);
  input.addEventListener('input', onUpdate);

  const label = document.createElement('label');
  label.textContent = `Opção ${optionCount}`;

  wrapper.appendChild(input);
  wrapper.appendChild(label);
  optionsContainer.appendChild(wrapper);

  onUpdate();
}

// Remover pergunta (já unificada)
export function removeQuestion(button, containerId = 'questionsContainer', prefix = '', onUpdate = () => {}) {
  const questionBlock = button.closest('.question-block');
  if (questionBlock) {
    questionBlock.remove();
    renumberQuestions(prefix);
    onUpdate();
  }
}

// Adicionar loader genérico
export function addLoader(config = {}) {
  const {
    containerId = 'questionsContainer',
    prefix = '',
    defaultText = 'Carregando...',
    onUpdate = () => {}
  } = config;

  const container = document.getElementById(containerId);
  const index = container.querySelectorAll('.loader-block').length + 1;

  const loaderBlock = document.createElement('div');
  loaderBlock.className = 'loader-block';
  loaderBlock.draggable = true;

  const funcName = prefix ? `removeLoader${prefix}` : 'removeLoader';

  loaderBlock.innerHTML = `
    <div class="drag-handle">≡≡</div>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div class="loader-label">Loading Step ${index}</div>
      <button type="button" onclick="${funcName}(this)" style="background: transparent; color: #ef4444; border: 1px solid #ef4444; border-radius: 4px; padding: 4px; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex: 0; width: fit-content;" title="Excluir loading">
        <span class="material-symbols-rounded" style="font-size: 16px;">delete</span>
      </button>
    </div>
    <div class="floating-label-group">
      <input type="text" placeholder=" " value="${defaultText}" />
      <label>Texto do Loading</label>
    </div>
  `;

  container.appendChild(loaderBlock);

  // Adicionar event listener
  const input = loaderBlock.querySelector('input');
  if (input) {
    input.addEventListener('input', onUpdate);
  }

  // Adicionar drag and drop
  setupDragAndDrop(loaderBlock);

  onUpdate();
}

// Remover loader (já unificada)
export function removeLoader(button, prefix = '', onUpdate = () => {}) {
  const loaderBlock = button.closest('.loader-block');
  if (loaderBlock) {
    loaderBlock.remove();
    renumberQuestions(prefix);
    onUpdate();
  }
}
