const imageInput = document.getElementById("imageInput");
const imageText = document.getElementById("imageText");
const readTextBtn = document.getElementById("readTextBtn");

const rateInput = document.getElementById("rate");
const pitchInput = document.getElementById("pitch");
const volumeInput = document.getElementById("volume");

imageInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
    }

    const uploadMessage = document.getElementById("uploadMessage");
    uploadMessage.textContent = "Processing image...";
    uploadMessage.style.color = "blue";

    try {
        const result = await Tesseract.recognize(
            file,
            'eng+ara', 
            {
                logger: (m) => console.log(m),
                tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 
                tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK, 
                preserve_interword_spaces: true 
            }
        );
        const extractedText = result.data.text.trim();
        imageText.value = extractedText;
        uploadMessage.textContent = "Upload successful!";
        uploadMessage.style.color = "green";

        const isArabic = /[\u0600-\u06FF]/.test(extractedText); 
        const language = isArabic ? "ar-SA" : "en-US"; 
        console.log(`Detected Language: ${language}`);

        readTextBtn.addEventListener("click", () => {
            const utterance = new SpeechSynthesisUtterance(extractedText);
            utterance.lang = language; 

            // إعدادات التحكم
            utterance.rate = parseFloat(rateInput.value);
            utterance.pitch = parseFloat(pitchInput.value);
            utterance.volume = parseFloat(volumeInput.value);

            window.speechSynthesis.speak(utterance);
        });

    } catch (error) {
        console.error("Error extracting text from image:", error);
        uploadMessage.textContent = "Failed to extract text from the image.";
        uploadMessage.style.color = "red";
    }
});

function toggleMenu() {
    const menuIcons = document.getElementById("menu-icons");
    menuIcons.classList.toggle("show");
}

let currentLanguage = 'en';  

function showPopup() {
    const errorModal = document.getElementById("errorModal");
    errorModal.classList.remove("hidden");

    const modalTitle = document.getElementById("modalTitle");
    const modalText = document.getElementById("modalText");

    if (currentLanguage === 'en') {
        modalTitle.textContent = "⚠️Input Error⚠️";
        modalText.textContent = "No image uploaded or no text extracted. Please upload a valid image with readable text.";
    } else {
        modalTitle.textContent = "⚠️خطأ في الإدخال⚠️";
        modalText.textContent = "لم يتم تحميل صورة أو استخراج نص. يرجى تحميل صورة صالحة تحتوي على نص قابل للقراءة.";
    }
}

function closePopup() {
    document.getElementById("errorModal").classList.add("hidden");
}

document.getElementById("readTextBtn").addEventListener("click", function() {
    const imageInput = document.getElementById("imageInput").files[0];

    if (!imageInput) {
        showPopup();
    } else {
        extractTextFromImage(imageInput);
    }
});

function extractTextFromImage(imageFile) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;

        img.onload = function() {
            Tesseract.recognize(img, 'eng', {
                logger: (m) => console.log(m)
            }).then(({ data: { text } }) => {
                document.getElementById("imageText").value = text;
            });
        };
    };
    reader.readAsDataURL(imageFile);
}

function toggleLanguage() {
    currentLanguage = (currentLanguage === 'en') ? 'ar' : 'en';  
    showPopup();  
}
