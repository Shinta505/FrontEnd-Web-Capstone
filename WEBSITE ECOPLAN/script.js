const toggleButton = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');

function toggleSidebar() {
    sidebar.classList.toggle('close');
    toggleButton.classList.toggle('rotate');
}

const dropArea = document.querySelector('.drop-section');
const listContainer = document.querySelector('.list');
const fileSelector = document.querySelector('.file-selector');
const fileSelectorInput = document.querySelector('.file-selector-input');

// Upload file with choose file button
fileSelector.onclick = () => fileSelectorInput.click();
fileSelectorInput.onchange = () => {
    [...fileSelectorInput.files].forEach((file) => {
        if (typeValidation(file.type)) {
            uploadFile(file);
        } else {
            console.warn("File tidak valid:", file.name);
        }
    });
};

// When file is over the drag area
dropArea.ondragover = (e) => {
    e.preventDefault();
    [...e.dataTransfer.items].forEach((item) => {
        if (typeValidation(item.type)) {
            dropArea.classList.add('drop-over-effect');
        }
    });
};

// When file leaves the drag area
dropArea.ondragleave = () => {
    dropArea.classList.remove('drop-over-effect');
};

// When file is dropped onto the drag area
dropArea.ondrop = (e) => {
    e.preventDefault();
    dropArea.classList.remove('drop-over-effect');
    if (e.dataTransfer.items) {
        [...e.dataTransfer.items].forEach((item) => {
            if (item.kind === 'file') {
                const file = item.getAsFile();
                if (typeValidation(file.type)) {
                    uploadFile(file);
                }
            }
        });
    } else {
        [...e.dataTransfer.files].forEach((file) => {
            if (typeValidation(file.type)) {
                uploadFile(file);
            }
        });
    }
};

// Check the file type (only images are valid)
function typeValidation(type) {
    const splitType = type.split('/')[0];
    return splitType === 'image';
}

// Upload file function
function uploadFile(file) {
    const li = document.createElement('li');
    li.classList.add('in-prog');
    li.innerHTML = `
        <div class="col">
            <img src="image/img.png" alt="img" width="50px">
        </div>
        <div class="col">
            <div class="file-name">
                <div class="name">${file.name}</div>
                <span>0%</span>
            </div>
            <div class="file-progress">
                <span></span>
            </div>
            <div class="file-size">${(file.size / (1024 * 1024)).toFixed(2)} MB</div>
        </div>
        <div class="col">
            <i class='cross bx bxs-x-circle'></i>
            <i class='ticky bx bxs-check-circle'></i>
        </div>
    `;
    listContainer.prepend(li);

    // Mock upload progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 10;
        li.querySelector('.file-name span').textContent = `${progress}%`;
        li.querySelector('.file-progress span').style.width = `${progress}%`;

        if (progress === 100) {
            clearInterval(progressInterval);
            li.classList.add('complete');
            li.classList.remove('in-prog');
            li.querySelector('.ticky').style.display = 'block';
        }
    }, 500);

    // Convert file to data URL and store it in sessionStorage
    const reader = new FileReader();
    reader.onloadend = function () {
        sessionStorage.setItem('uploadedImage', reader.result);
        window.location.href = 'hasil-deteksi.html';
    };
    reader.readAsDataURL(file);
}