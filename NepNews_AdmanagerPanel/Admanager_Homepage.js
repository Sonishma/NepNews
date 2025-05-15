document.addEventListener('DOMContentLoaded', function () {
    const continueButton = document.querySelector('.continue-btn');
    const uploadArea = document.querySelector('.image-upload-area');

    let selectedImageFile = null;

    if (uploadArea) {
        uploadArea.addEventListener('click', function () {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';

            document.body.appendChild(fileInput);
            fileInput.click();

            fileInput.addEventListener('change', function (event) {
                if (event.target.files && event.target.files[0]) {
                    const file = event.target.files[0];

                    if (!file.type.startsWith('image/')) {
                        alert("Please select a valid image file.");
                        return;
                    }

                    selectedImageFile = file;
                    const reader = new FileReader();

                    reader.onload = function (e) {
                        uploadArea.style.backgroundImage = `url('${e.target.result}')`;
                        uploadArea.style.backgroundSize = 'cover';
                        uploadArea.style.backgroundPosition = 'center';
                    };

                    reader.readAsDataURL(file);
                }
            });
        });
    }

    if (continueButton) {
        continueButton.addEventListener('click', function () {
            const title = document.querySelector('.form-control[placeholder="Ad Title"]')?.value;
            const websiteLink = document.querySelector('.form-control[placeholder="Ad website link"]')?.value;
            const position = document.getElementById('positionSelect')?.value;
            const durationInput = document.querySelector('input[name="duration"]:checked');
            const duration = durationInput ? durationInput.nextSibling.textContent.trim() : null;

            if (!title || !websiteLink || !position || !duration || !selectedImageFile) {
                alert("Please fill in all fields and upload an image before proceeding.");
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                const adData = {
                    title: title,
                    websiteLink: websiteLink,
                    position: position,
                    duration: duration,
                    imageBase64: e.target.result // Save base64 image for preview
                };

                // Store in localStorage to use in summary page
                localStorage.setItem('adData', JSON.stringify(adData));
                window.location.href = 'Admanager_Summary.html';
            };
            reader.readAsDataURL(selectedImageFile);
        });
    }
});