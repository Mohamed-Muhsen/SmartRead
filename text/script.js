var voices = [];
const voiceSelect = document.getElementById("voiceSelect");

function populatedVoiceList() {
    voices = window.speechSynthesis.getVoices();
    voiceSelect.innerHTML = "";
    voices.forEach((voice, index) => {
        console.log(voice);
        var option = document.createElement("option");
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = index;
        voiceSelect.appendChild(option);
    });
}
if (typeof speechSynthesis !== "undefined" && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populatedVoiceList;
}

function speak() {
    const textValue = document.getElementById("text").value.trim();
    const utterance = new SpeechSynthesisUtterance(textValue);
    const voiceSelectIndex = voiceSelect.value;
    utterance.voice = voices[voiceSelectIndex];

    utterance.rate = parseFloat(document.getElementById("rate").value);
    utterance.pitch = parseFloat(document.getElementById("pitch").value);
    utterance.volume = parseFloat(document.getElementById("volume").value);

    const selectedVoiceLang = voices[voiceSelectIndex].lang;
    if (!isTextCompatibleWithVoice(textValue, selectedVoiceLang)) {
        showPopup();
        return;
    }

    window.speechSynthesis.speak(utterance);
}

function isTextCompatibleWithVoice(text, lang) {
    const textLangRegex = getLanguageRegex(lang);
    return textLangRegex.test(text);
}

function getLanguageRegex(lang) {
    if (lang.startsWith("ar")) {
        return /[\u0600-\u06FF]/; 
    } else if (lang.startsWith("en")) {
        return /^[A-Za-z0-9\s.,!?]+$/; 
    } else if (lang.startsWith("zh")) {
        return /[\u4e00-\u9fff]/; 
    } else if (lang.startsWith("ru")) {
        return /[\u0400-\u04FF]/; 
    } else if (lang.startsWith("ja")) {
        return /[\u3040-\u30FF\u4E00-\u9FFF]/;
    } else if (lang.startsWith("ko")) {
        return /[\uAC00-\uD7AF]/; 
    }
    return /[\s\S]+/; 
}

let currentLanguage = 'en';

function showPopup() {
    const errorModal = document.getElementById("errorModal");
    errorModal.classList.remove("hidden");
    
    const modalText = document.getElementById("modalText");
    
    if (currentLanguage === 'en') {
        document.getElementById("modalTitle").textContent = "⚠️Input Error⚠️";
        modalText.textContent = "The text is not compatible with the selected language. Please type the text in the correct language or choose a voice that matches the text.";
    } else {
        document.getElementById("modalTitle").textContent = "⚠️خطأ في الإدخال⚠️";
        modalText.textContent = "النص غير متوافق مع اللغة المختارة. يرجى كتابة النص باللغة الصحيحة أو اختيار صوت يتناسب مع النص.";
    }
}

function closePopup() {
    document.getElementById("errorModal").classList.add("hidden");
}

function toggleLanguage() {
    currentLanguage = (currentLanguage === 'en') ? 'ar' : 'en';
        showPopup();
}
function toggleMenu() {
    const menuIcons = document.getElementById("menu-icons");
    menuIcons.classList.toggle("show");
}


setTimeout(() => {
    document.getElementById("splashScreen").classList.add("hiddenn");
}, 5000);