const galleryContainer = document.getElementById('gallery');
const dropArea = document.getElementById('drop-area');

function showPreview(file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    const galleryItemContainer = document.createElement('div');
    galleryItemContainer.classList.add('galleryItemContainer');
    galleryContainer.appendChild(galleryItemContainer);

    const img = document.createElement('img');
    img.src = reader.result;
    galleryItemContainer.appendChild(img);

    const removeGalleryItem = document.createElement('div');
    removeGalleryItem.classList.add('removeGalleryItem');
    removeGalleryItem.textContent = '✖';
    galleryItemContainer.appendChild(removeGalleryItem);

    removeGalleryItem.onclick = () => {
      galleryContainer.removeChild(galleryItemContainer);
    };
  };
}

function preventDefaults(event) {
  event.preventDefault();
  event.stopPropagation();
}

['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults);
});

// on drop
dropArea.addEventListener('drop', (event) => {
  for (const file of event.dataTransfer.files || []) {
    showPreview(file);
  }
});

// on file upload
const fileUploader = document.getElementById('fileUploader');
fileUploader.onchange = () => {
  for (const file of fileUploader.files || []) {
    showPreview(file);
  }
  fileUploader.value = '';
};
