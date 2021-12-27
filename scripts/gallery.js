const gallery = document.getElementById('gallery');
const images = JSON.parse(localStorage.getItem('images')) ?? [];
const clearBtn = document.getElementById('clear_btn');
const galleryMessage = document.getElementById('gallery_message');

const overlayImage = document.querySelector('.overlay-image');

if (images.length === 0) {
    galleryMessage.innerText = `You do not have any images yet.`;
    clearBtn.style.display = 'none';
} else {
    images.forEach((image) =>  {
        const img = document.createElement('img');
        img.setAttribute('src', image.dataUrl);
        gallery.appendChild(img);

        img.addEventListener('click', () => {
            toggleOverlayImage();
            setOverlayImg(image.dataUrl);
        });
    });
}

overlayImage.addEventListener('click', () => {
    toggleOverlayImage();
    setTimeout(() => setOverlayImg(''), 500);
});

clearBtn.addEventListener('click', () => {
    localStorage.removeItem('images');
    galleryMessage.innerText = `You do not have any images yet.`;
    gallery.innerHTML = '';
    clearBtn.style.display = 'none';
});

function setOverlayImg(src) {
    const img = overlayImage.querySelector('img');
    img.setAttribute('src', src);
}
function toggleOverlayImage() {
    overlayImage.classList.toggle('overlay-image--open');
}