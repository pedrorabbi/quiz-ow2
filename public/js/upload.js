// Funções para upload de imagem

export async function uploadImage(file, imageInput, imagePreview, previewImg, uploadBtn, uploadText) {
  try {
    // Mostrar estado de loading
    uploadBtn.classList.add("uploading");
    uploadText.textContent = "Enviando...";

    // Mostrar preview local imediatamente
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);

    // Fazer upload para o servidor
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/upload/image', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      // Armazenar URL da imagem no input como data attribute
      imageInput.setAttribute('data-image-url', result.imageUrl);

      // Atualizar botão para sucesso
      uploadBtn.classList.remove("uploading");
      uploadBtn.classList.add("has-image");
      uploadText.textContent = file.name;
    } else {
      console.error('Erro no upload:', result.error);
      alert('Erro ao fazer upload da imagem: ' + result.error);

      // Limpar preview e resetar botão em caso de erro
      imagePreview.style.display = "none";
      imageInput.value = "";
      uploadBtn.classList.remove("uploading", "has-image");
      uploadText.textContent = "Escolher imagem";
    }

  } catch (error) {
    console.error('Erro no upload:', error);
    alert('Erro ao fazer upload da imagem');

    // Limpar preview e resetar botão em caso de erro
    imagePreview.style.display = "none";
    imageInput.value = "";
    uploadBtn.classList.remove("uploading", "has-image");
    uploadText.textContent = "Escolher imagem";
  }
}
