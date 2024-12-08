const toggleButton = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');

function toggleSidebar() {
    sidebar.classList.toggle('close');
    toggleButton.classList.toggle('rotate');
}

const dropArea = document.querySelector('.drop-section'); // Gunakan querySelector untuk elemen tunggal
const listContainer = document.querySelector('.list'); // Gunakan querySelector untuk elemen tunggal

const fileSelector = document.querySelector('.file-selector');
const fileSelectorInput = document.querySelector('.file-selector-input');

fileSelector.onclick = () => {
    console.log('File selector clicked');
    fileSelectorInput.click();
};

fileSelectorInput.onchange = () => {
    console.log('Selected files:', fileSelectorInput.files);
    [...fileSelectorInput.files].forEach((file) => {
        if (typeValidation(file.type)) {
            uploadFile(file);
        } else {
            console.warn("File tidak valid:", file.name);
        }
    });
};

// Ketika file berada di atas area drag
dropArea.ondragover = (e) => {
    e.preventDefault();
    [...e.dataTransfer.items].forEach((item) => {
        if (typeValidation(item.type)) {
            dropArea.classList.add('drop-over-effect');
        }
    });
};

// Ketika file keluar dari area drag
dropArea.ondragleave = () => {
    dropArea.classList.remove('drop-over-effect');
};

// Ketika file dilepaskan di area drag
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

// Validasi tipe file (hanya gambar yang valid)
function typeValidation(type) {
    const splitType = type.split('/')[0];
    return splitType === 'image';
}

if (!listContainer) {
    console.error("Error: listContainer is null. Ensure the '.list' element exists in the HTML.");
}

// Fungsi upload file
function uploadFile(file) {
    if (!listContainer) return; // Hindari error jika elemen tidak ditemukan

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

    // Simulasi progress upload
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

    // Konversi file ke data URL dan simpan di sessionStorage
    const reader = new FileReader();
    reader.onloadend = function () {
        sessionStorage.setItem('uploadedImage', reader.result);
        window.location.href = 'hasil-deteksi.html';
    };
    reader.readAsDataURL(file);
}

$(document).ready(function () {
    $(".vid").click(function () {
        let youtube_id = $(this).children("img").attr("data_id");
        console.log(youtube_id);
        $(this).children("img").addClass("active").parent().siblings().children("img").removeClass("active");

        let video_id = $("#video_id").attr("src");
        let newUrl = `https://www.youtube.com/embed/${video_id}`;
        $("#video_id").attr("src", newUrl);
    });
});
