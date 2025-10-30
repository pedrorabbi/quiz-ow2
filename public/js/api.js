// Funções para chamadas de API

export async function createQuizLink(htmlTemplate, vertical, domain) {
  try {
    const response = await fetch('https://custom-embed.humberto-56a.workers.dev/s/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ElegantQuiz-ApiKey': 'cmbr8lju0000009l85ri155xj'
      },
      body: JSON.stringify({
        name: vertical,
        data: {
          html_array: [htmlTemplate]
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Resposta da API createQuizLink:', result);
    return result;
  } catch (error) {
    console.error('Erro ao criar link:', error);
    throw error;
  }
}

export async function sendWebhook(url, quizData) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quizData)
    });

    return response.ok;
  } catch (error) {
    console.error('Erro ao enviar webhook:', error);
    return false;
  }
}
