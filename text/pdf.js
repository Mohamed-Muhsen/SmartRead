const pdfInput = document.getElementById("pdfInput");
const pdfText = document.getElementById("pdfText");
const readTextBtn = document.getElementById("readTextBtn");

const rateInput = document.getElementById("rate");
const pitchInput = document.getElementById("pitch");
const volumeInput = document.getElementById("volume");

pdfInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== "application/pdf") {
        alert("Please upload a valid PDF file.");
        return;
    }

    const fileReader = new FileReader();
    fileReader.onload = async function () {
        try {
            const pdfData = new Uint8Array(this.result);
            const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;

            let extractedText = "";
            for (let i = 1; i <= pdfDoc.numPages; i++) {
                const page = await pdfDoc.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item) => item.str).join(" ");
                extractedText += pageText + "\n\n";
            }

            pdfText.value = extractedText.trim();
        } catch (error) {
            console.error("Error reading PDF:", error);
            alert("Failed to extract text from the PDF.");
        }
    };

    fileReader.readAsArrayBuffer(file);
});

readTextBtn.addEventListener("click", () => {
    const textValue = pdfText.value;
 

    const utterance = new SpeechSynthesisUtterance(textValue);

    utterance.rate = parseFloat(rateInput.value);
    utterance.pitch = parseFloat(pitchInput.value);
    utterance.volume = parseFloat(volumeInput.value);

    const isArabic = /[\u0600-\u06FF]/.test(textValue);
    utterance.lang = isArabic ? "ar-SA" : "en-US";

    window.speechSynthesis.speak(utterance);
});
function toggleMenu() {
    const menuIcons = document.getElementById("menu-icons");
    menuIcons.classList.toggle("show");
}

const uploadMessage = document.getElementById("uploadMessage");

pdfInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    
    if (file && file.type === "application/pdf") {
        uploadMessage.textContent = "Upload successful!";
        uploadMessage.style.color = "green"; 
    } else {
        uploadMessage.textContent = "Please upload a valid PDF file.";
        uploadMessage.style.color = "red";
    }
});

let currentLanguage = 'en';

function showPopup() {
    const errorModal = document.getElementById("errorModal");
    errorModal.classList.remove("hidden");

    const modalTitle = document.getElementById("modalTitle");
    const modalText = document.getElementById("modalText");

    if (currentLanguage === 'en') {
        modalTitle.textContent = "⚠️Input Error⚠️";
        modalText.textContent = "No PDF file uploaded. Please upload a valid PDF file.";
    } else {
        modalTitle.textContent = "⚠️خطأ في الإدخال⚠️";
        modalText.textContent = `  PDF صالح يرجى تحميل ملف  
       , PDF لم يتم تحميل ملف `
    }
}

function closePopup() {
    document.getElementById("errorModal").classList.add("hidden");
}

document.getElementById("readTextBtn").addEventListener("click", function() {
    const pdfInput = document.getElementById("pdfInput").files[0];

    if (!pdfInput) {
        showPopup();
    } else {
        readPDF(pdfInput);
    }
});

// Function to read the PDF file
function readPDF(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const pdfData = e.target.result;
        const loadingTask = pdfjsLib.getDocument(pdfData);
        loadingTask.promise.then(function(pdf) {
            pdf.getPage(1).then(function(page) {
                page.getTextContent().then(function(textContent) {
                    const pdfText = textContent.items.map(item => item.str).join(' ');
                    document.getElementById("pdfText").value = pdfText;
                });
            });
        });
    };
    reader.readAsArrayBuffer(file);
}

function toggleLanguage() {
    currentLanguage = (currentLanguage === 'en') ? 'ar' : 'en';
    showPopup();  
}
