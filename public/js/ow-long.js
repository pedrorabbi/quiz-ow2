// OW Long - Lógica exclusiva para quiz long form
import { showNotification, showQuizPreviewModal } from './utils.js';
import { createQuizLink } from './api.js';
import { saveQuizToHistory, getQuizHistory, deleteQuizFromHistory, renderQuizHistory } from './history.js';
import { renumberQuestions } from './dragdrop.js';
import { addQuestion, addOption, removeQuestion, addLoader, removeLoader } from './questions.js';

// Template HTML base para OW Long (minificado)
const baseTemplate = `<!doctypehtml><html lang='en'><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1.0'><title>Quiz Minimalista</title><link href='https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap' rel='stylesheet'><style>:root{--bg-light:#f9fafb;--card-bg:#ffffff;--primary:#2563eb;--primary-hover:#1e40af;--text-dark:#1f2937;--text-light:#4b5563}*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Roboto',sans-serif;background:var(--bg-light);display:flex;align-items:center;justify-content:center;height:100vh}.quiz-card{position:relative;background:var(--card-bg);border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,.05);width:100%;max-width:500px;padding:1rem;padding-top:2.5rem;text-align:center;overflow:hidden;height:100%}.progress{position:absolute;top:0;left:0;width:100%;height:6px;background:#e5e7eb}.progress__bar{height:100%;width:0;background:var(--primary);transition:width .4s;border-top-left-radius:12px;border-top-right-radius:12px}.question{font-size:1.25rem;color:var(--text-dark);margin-bottom:1rem;min-height:3rem;display:flex;align-items:center;justify-content:center}.options{display:grid;gap:.75rem;margin-bottom:2rem}.option,.recommend-btn{font-size:1rem;background:var(--primary);color:#fff;padding:1.25rem;border-radius:8px;text-decoration:none;font-weight:700;transition:background .3s;cursor:pointer;border:none}.option:hover,.recommend-btn:hover{background:var(--primary-hover)}.loading-step{display:none;flex-direction:column;align-items:center;gap:1rem;margin-bottom:2rem}.spinner{border:4px solid #e5e7eb;border-top:4px solid var(--primary);border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite}@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}.award-text{font-size:1.25rem;color:var(--text-dark);margin-bottom:1rem;font-weight:500}.loading-text{font-size:1rem;color:var(--text-dark)}.footnote{font-size:.875rem;color:var(--text-light)}</style><body><div class='quiz-card'><div class='progress'><div class='progress__bar'></div></div><div class='question'></div><div class='options'></div><div class='loading-step'><div class='spinner'></div><div class='loading-text'>Preparing your job matches…</div></div><a data-av-rewarded='true' id='submitLink' style='display:none'></a></div><script>const questions=[{q:'What hourly pay are you targeting (USD)?',opts:['$15–$18/hr','$19–$22/hr','$23–$28/hr','$29+/hr']},{q:'Which type of employment do you prefer?',opts:['Part-time','Full-time','Home Office']},{q:'When could you start?',opts:['Immediately','Within 1 week','Within 2 weeks','Next month']}];let idx=0;const questionEl=document.querySelector('.question'),optionsEl=document.querySelector('.options'),loadingEl=document.querySelector('.loading-step'),progressBar=document.querySelector('.progress__bar');function render(){questionEl.style.display='none';optionsEl.style.display='none';loadingEl.style.display='none';const e=questions.length+1;progressBar.style.width=idx/e*100+'%';if(idx<questions.length){const{q:e,opts:t}=questions[idx];questionEl.textContent=e;questionEl.style.display='flex';optionsEl.style.display='grid';optionsEl.innerHTML='';t.forEach(e=>{const t=document.createElement('button');t.className='option';t.textContent=e;t.addEventListener('click',e=>{e.preventDefault();idx++;render()});optionsEl.appendChild(t)})}else if(idx===questions.length){loadingEl.style.display='flex';setTimeout(()=>{idx++;render()},5e3)}else{optionsEl.style.display='grid';optionsEl.innerHTML='';const e=document.createElement('div');e.className='award-text';e.textContent='Job opportunities are waiting for you!';const t='http://redirect.customerchannels.com/rec-cc-cowl-jobs-us';const s=document.getElementById('submitLink');s.href=t;optionsEl.appendChild(e);const n=document.createElement('button');n.className='recommend-btn';n.textContent='SEE JOBS';n.addEventListener('click',e=>{e.preventDefault();if(typeof window.parent.av!=='undefined'&&typeof window.parent!=='undefined'){const e=window.parent.av.slots.find(e=>e.type==='rewarded'&&e.lifecycle==='ready');if(!e){const e=new URL(window.top.location.href);console.log('OfferWallSlot não encontrado');const n=new Date;n.setDate(n.getDate()+7);document.cookie=['loaderCopy=','Domain=.customerchannels.com','Path=/',\`Expires=\${n.toUTCString()}\`,'SameSite=Lax'].join('; ');document.cookie=['rewardedReady=true','Domain=.customerchannels.com','Path=/',\`Expires=\${n.toUTCString()}\`,'SameSite=Lax'].join('; ');const o=\`\${t}\${e?.search}\`;window.parent.postMessage({action:'redirect',url:o},'*');return}}s.click()});optionsEl.appendChild(n);const o=document.createElement('div');o.className='footnote';o.textContent='See the ad to proceed';optionsEl.appendChild(o)}}render();<\/script></body></html>`;

// Wrapper functions para usar o módulo unificado
window.addQuestionLong = function() {
  addQuestion({
    containerId: 'questionsContainer-long',
    questionClass: 'question-input-long',
    optionClass: 'option-input-long',
    prefix: 'Long',
    onUpdate: updatePreviewLong,
    withImageUpload: false
  });
};

window.addOptionLong = function(button) {
  addOption(button, 'option-input-long', updatePreviewLong);
};

window.removeQuestionLong = function(button) {
  removeQuestion(button, 'questionsContainer-long', 'long', updatePreviewLong);
};

window.addLoadingStepLong = function() {
  addLoader({
    containerId: 'questionsContainer-long',
    prefix: 'Long',
    defaultText: 'Preparing your job matches…',
    onUpdate: updatePreviewLong
  });
};

window.removeLoadingLong = function(button) {
  removeLoader(button, 'long', updatePreviewLong);
};

// Coletar dados das perguntas
function collectQuestionsData() {
  const questions = [];
  const container = document.getElementById('questionsContainer-long');
  const questionBlocks = container.querySelectorAll('.question-block');

  questionBlocks.forEach((block) => {
    const questionInput = block.querySelector('.question-input-long');
    const questionText = questionInput?.value || '';

    const optionsContainer = block.querySelector('.options-container');
    const optionInputs = optionsContainer?.querySelectorAll('.option-input-long');
    const opts = [];

    optionInputs?.forEach(input => {
      if (input.value) {
        opts.push(input.value);
      }
    });

    if (questionText || opts.length > 0) {
      questions.push({
        q: questionText,
        opts: opts
      });
    }
  });

  return questions;
}

// Atualizar preview visual
window.updatePreviewLong = function() {
  const questions = collectQuestionsData();
  const primaryColor = document.getElementById('primaryColor-long')?.value || '#2563eb';
  const primaryHover = document.getElementById('primaryHover-long')?.value || '#1e40af';

  // Atualizar preview visual
  const previewContainer = document.getElementById('previewQuestions-long');
  if (!previewContainer) return;

  // Atualizar cor da barra de progresso
  const progressFill = document.getElementById('topProgressFill-long');
  if (progressFill) {
    progressFill.style.backgroundColor = primaryColor;
  }

  if (questions.length === 0) {
    previewContainer.innerHTML = `
      <div style="text-align: center; color: #999; padding: 40px;">
        Adicione perguntas para ver o preview
      </div>
    `;
    return;
  }

  // Mostrar primeira pergunta no preview
  const firstQuestion = questions[0];
  previewContainer.innerHTML = `
    <div class="preview-question" style="margin-bottom: 20px; text-align: center;">
      <h4 style="margin: 0 0 15px 0; color: #333; font-size: 1.25rem;">
        ${firstQuestion.q || 'Pergunta de exemplo'}
      </h4>
      <div class="preview-options">
        ${firstQuestion.opts.map(opt => `
          <button
            class="preview-option-long"
            style="
              display: block;
              width: 100%;
              padding: 1.25rem;
              margin: 8px 0;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 1rem;
              background: ${primaryColor};
              color: white;
              font-weight: 700;
            "
            onmouseover="this.style.background='${primaryHover}'"
            onmouseout="this.style.background='${primaryColor}'"
          >
            ${opt}
          </button>
        `).join('')}
      </div>
    </div>
  `;

  // Atualizar barra de progresso (primeira pergunta)
  if (progressFill) {
    const totalSteps = questions.length + 1;
    progressFill.style.width = (1 / totalSteps * 100) + '%';
  }
};

// Criar quiz (postar na API)
window.createQuizLong = async function() {
  const vertical = document.getElementById('vertical-long').value;
  const domain = document.getElementById('domain-long').value;

  if (!vertical || !domain) {
    alert('Por favor, preencha Vertical e Domínio');
    return;
  }

  const questions = collectQuestionsData();
  if (questions.length === 0) {
    alert('Por favor, adicione pelo menos uma pergunta');
    return;
  }

  const primaryColor = document.getElementById('primaryColor-long')?.value || '#2563eb';
  const primaryHover = document.getElementById('primaryHover-long')?.value || '#1e40af';

  // Coletar textos customizáveis
  const loadingText = document.getElementById('loadingText-long')?.value || 'Preparing your job matches…';
  const awardText = document.getElementById('awardText-long')?.value || 'Job opportunities are waiting for you!';
  const buttonText = document.getElementById('buttonText-long')?.value || 'SEE JOBS';
  const footnoteText = document.getElementById('footnoteText-long')?.value || 'See the ad to proceed';
  const redirectUrl = document.getElementById('redirectUrl-long')?.value || 'http://redirect.customerchannels.com/rec-cc-cowl-jobs-us';

  // Modificar o template base
  let modifiedHtml = baseTemplate;

  // Substituir cores
  modifiedHtml = modifiedHtml.replace(/--primary:#2563eb/g, `--primary:${primaryColor}`);
  modifiedHtml = modifiedHtml.replace(/--primary-hover:#1e40af/g, `--primary-hover:${primaryHover}`);

  // Substituir array de perguntas
  const questionsJson = JSON.stringify(questions);
  modifiedHtml = modifiedHtml.replace(
    /const questions=\[.*?\];/,
    `const questions=${questionsJson};`
  );

  // Substituir textos customizáveis
  modifiedHtml = modifiedHtml.replace(/Preparing your job matches…/g, loadingText);
  modifiedHtml = modifiedHtml.replace(/Job opportunities are waiting for you!/g, awardText);
  modifiedHtml = modifiedHtml.replace(/SEE JOBS/g, buttonText);
  modifiedHtml = modifiedHtml.replace(/See the ad to proceed/g, footnoteText);
  modifiedHtml = modifiedHtml.replace(/http:\/\/redirect\.customerchannels\.com\/rec-cc-cowl-jobs-us/g, redirectUrl);

  try {
    // Fazer POST na API do custom-embed
    const result = await createQuizLink(modifiedHtml, vertical, domain);

    console.log('Resultado completo da API:', result);

    // A API retorna success=true e um campo 'file' com o nome do arquivo
    let quizUrl = null;

    if (result.success) {
      // Montar URL com domínio e vertical do usuário
      quizUrl = `${domain}quiz/${vertical}/1`;
    }

    if (quizUrl) {
      // Mostrar modal com preview do quiz
      showQuizPreviewModal(quizUrl, modifiedHtml);

      // Salvar no histórico
      saveQuizToHistory({
        vertical,
        domain,
        url: quizUrl,
        questions,
        loadingText,
        awardText,
        buttonText,
        footnoteText,
        redirectUrl,
        primaryColor,
        primaryHover
      }, 'long');

      // Atualizar lista de histórico
      renderQuizHistory('historyList-long', null, null, 'long');
    } else {
      console.error('Resposta da API sem URL:', result);
      alert('Erro ao criar quiz: API não retornou URL. Verifique o console.');
    }
  } catch (error) {
    console.error('Erro ao criar quiz:', error);
    alert('Erro ao criar quiz: ' + error.message);
  }
};

// Expor função de renumeração
window.renumberQuestions = renumberQuestions;

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  // Carregar histórico
  renderQuizHistory('historyList-long', null, null, 'long');

  // Inicializar preview
  updatePreviewLong();

  // Adicionar listeners para cores
  document.getElementById('primaryColor-long')?.addEventListener('change', updatePreviewLong);
  document.getElementById('primaryHover-long')?.addEventListener('change', updatePreviewLong);
});

// Funções para histórico (expor globalmente)
window.duplicateQuizFromHistory = function(id, prefix = '') {
  const history = getQuizHistory(prefix);
  const quiz = history.find(item => item.id === id);

  if (quiz && prefix === 'long') {
    // Duplicar quiz long - campos básicos
    document.getElementById('vertical-long').value = quiz.vertical || '';
    document.getElementById('domain-long').value = quiz.domain || '';

    // Restaurar cores
    if (quiz.primaryColor) document.getElementById('primaryColor-long').value = quiz.primaryColor;
    if (quiz.primaryHover) document.getElementById('primaryHover-long').value = quiz.primaryHover;

    // Restaurar textos customizáveis
    if (quiz.loadingText) document.getElementById('loadingText-long').value = quiz.loadingText;
    if (quiz.awardText) document.getElementById('awardText-long').value = quiz.awardText;
    if (quiz.buttonText) document.getElementById('buttonText-long').value = quiz.buttonText;
    if (quiz.footnoteText) document.getElementById('footnoteText-long').value = quiz.footnoteText;
    if (quiz.redirectUrl) document.getElementById('redirectUrl-long').value = quiz.redirectUrl;

    // Limpar perguntas existentes
    document.getElementById('questionsContainer-long').innerHTML = '';

    // Recriar perguntas
    if (quiz.questions && Array.isArray(quiz.questions)) {
      quiz.questions.forEach(q => {
        window.addQuestionLong();

        // Pegar o container da última pergunta adicionada
        const container = document.getElementById('questionsContainer-long');
        const lastQuestion = container.lastElementChild;

        // Preencher texto da pergunta
        const qInput = lastQuestion.querySelector('.question-input-long');
        if (qInput) qInput.value = q.q || '';

        // Preencher opções (as 2 primeiras já existem, adicionar as demais)
        const optionInputs = lastQuestion.querySelectorAll('.option-input-long');
        if (q.opts && Array.isArray(q.opts)) {
          q.opts.forEach((opt, idx) => {
            if (idx < 2) {
              // Preencher as 2 opções que já existem
              if (optionInputs[idx]) optionInputs[idx].value = opt;
            } else {
              // Adicionar novas opções
              const addButton = lastQuestion.querySelector('button[onclick^="addOptionLong"]');
              if (addButton) {
                window.addOptionLong(addButton);
                const newOptionInputs = lastQuestion.querySelectorAll('.option-input-long');
                if (newOptionInputs[idx]) newOptionInputs[idx].value = opt;
              }
            }
          });
        }
      });
    }

    updatePreviewLong();
    showNotification('Quiz duplicado com sucesso!');
  }
};

window.deleteQuizFromHistory = function(id, prefix = '') {
  if (confirm('Tem certeza que deseja excluir este quiz do histórico?')) {
    deleteQuizFromHistory(id, prefix);
    renderQuizHistory('historyList-' + prefix, null, null, prefix);
  }
};

console.log('OW Long - Módulo carregado');
