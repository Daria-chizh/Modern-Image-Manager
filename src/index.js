// const serverHost = 'http://localhost:7777';
const serverHost = 'https://dablov-image-uploader.herokuapp.com';

const galleryContainer = document.getElementById('gallery');
const dropArea = document.getElementById('drop-area');

function showPreview(src, fileName) {
  const galleryItemContainer = document.createElement('div');
  galleryItemContainer.classList.add('galleryItemContainer');
  galleryContainer.appendChild(galleryItemContainer);

  const img = document.createElement('img');
  img.src = src;
  galleryItemContainer.appendChild(img);

  const removeGalleryItem = document.createElement('div');
  removeGalleryItem.classList.add('removeGalleryItem');
  removeGalleryItem.textContent = '✖';
  galleryItemContainer.appendChild(removeGalleryItem);

  removeGalleryItem.onclick = () => {
    const formData = new FormData();
    formData.append('fileName', fileName);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${serverHost}/?method=removeImage`);
    xhr.send(formData);

    galleryContainer.removeChild(galleryItemContainer);
  };
}

function showPreviewFromLocalFile(file, fileName) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    showPreview(reader.result, fileName);
  };
}

function uploadFile(file) {
  const formData = new FormData();
  formData.append('photo', file);

  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status !== 200) {
      return;
    }

    const { fileName } = JSON.parse(xhr.responseText);
    showPreviewFromLocalFile(file, fileName);
  };
  xhr.open('POST', `${serverHost}/?method=uploadImage`);
  xhr.send(formData);
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
    uploadFile(file);
  }
});

// on file upload control
const fileUploader = document.getElementById('fileUploader');
fileUploader.onchange = () => {
  for (const file of fileUploader.files || []) {
    uploadFile(file);
  }
  fileUploader.value = '';
};

// load images on that start
function initGallery() {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status !== 200) {
      return;
    }

    const images = JSON.parse(xhr.responseText);
    for (const imageFileName of images) {
      showPreview(`${serverHost}/${imageFileName}`, imageFileName);
    }
  };
  xhr.open('GET', `${serverHost}/?method=listImages`);
  xhr.send();
}

initGallery();
