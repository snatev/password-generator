const passwordDisplay = document.getElementById('passwordDisplay');
const copyBtn = document.getElementById('copyBtn');
const copyNotification = document.getElementById('copyNotification');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const uppercaseOption = document.getElementById('uppercaseOption');
const lowercaseOption = document.getElementById('lowercaseOption');
const numbersOption = document.getElementById('numbersOption');
const symbolsOption = document.getElementById('symbolsOption');
const similarOption = document.getElementById('similarOption');
const ambiguousOption = document.getElementById('ambiguousOption');
const advancedToggle = document.getElementById('advancedToggle');
const advancedOptions = document.getElementById('advancedOptions');
const strengthBadge = document.getElementById('strengthBadge');
const strengthFill = document.getElementById('strengthFill');
const generateBtn = document.getElementById('generateBtn');

const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '0123456789';
const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/';
const similarChars = 'il1Lo0O';
const ambiguousChars = '{}[]()/\\\'"`~,;:.<>';

window.addEventListener('DOMContentLoaded', () => {
    updateSliderValue();
    generatePassword();
    createBubbles();
    setInterval(createBubbles, 3000);
});

lengthSlider.addEventListener('input', updateSliderValue);
lengthSlider.addEventListener('change', generatePassword);
uppercaseOption.addEventListener('change', generatePassword);
lowercaseOption.addEventListener('change', generatePassword);
numbersOption.addEventListener('change', generatePassword);
symbolsOption.addEventListener('change', generatePassword);
similarOption.addEventListener('change', generatePassword);
ambiguousOption.addEventListener('change', generatePassword);

advancedToggle.addEventListener('change', () => {
    advancedOptions.style.display = advancedToggle.checked ? 'block' : 'none';
});

copyBtn.addEventListener('click', copyToClipboard);
generateBtn.addEventListener('click', () => {
    generateBtn.classList.add('generating');
    generateBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Generating';

    setTimeout(() => {
        generatePassword();
        generateBtn.classList.remove('generating');
        generateBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Generate Password';
    }, 250);
});

function updateSliderValue() {
    lengthValue.textContent = lengthSlider.value;
    generatePassword();
}

function generatePassword() {
    if (!uppercaseOption.checked && !lowercaseOption.checked && 
        !numbersOption.checked && !symbolsOption.checked) {
        lowercaseOption.checked = true;
    }

    let chars = '';
    if (uppercaseOption.checked) chars += uppercaseChars;
    if (lowercaseOption.checked) chars += lowercaseChars;
    if (numbersOption.checked) chars += numberChars;
    if (symbolsOption.checked) chars += symbolChars;

    if (similarOption && similarOption.checked) {
        for (let char of similarChars) {
            chars = chars.split(char).join('');
        }
    }

    if (ambiguousOption && ambiguousOption.checked) {
        for (let char of ambiguousChars) {
            chars = chars.split(char).join('');
        }
    }

    const length = parseInt(lengthSlider.value);
    let password = '';

    if (uppercaseOption.checked) password += getRandomChar(uppercaseChars);
    if (lowercaseOption.checked) password += getRandomChar(lowercaseChars);
    if (numbersOption.checked) password += getRandomChar(numberChars);
    if (symbolsOption.checked) password += getRandomChar(symbolChars);

    while (password.length < length) {
        password += getRandomChar(chars);
    }

    password = shuffleString(password);
    password = password.slice(0, length);

    passwordDisplay.textContent = password;
    updatePasswordStrength(password);
}

function getRandomChar(characters) {
    return characters.charAt(Math.floor(Math.random() * characters.length));
}

function shuffleString(string) {
    const array = string.split('');

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array.join('');
}

function updatePasswordStrength(password) {
    let score = 0;

    const length = password.length;
    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    if (length >= 20) score += 1;
    if (length >= 24) score += 1;

    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const percentage = (score / 9) * 100;
    strengthFill.style.width = `${percentage}%`;

    if (score < 3) {
        strengthBadge.textContent = 'Weak';
        strengthBadge.className = 'strength-badge weak';
        strengthFill.style.backgroundColor = '#ef4444';
    } else if (score < 6) {
        strengthBadge.textContent = 'Medium';
        strengthBadge.className = 'strength-badge medium';
        strengthFill.style.backgroundColor = '#f59e0b';
    } else {
        strengthBadge.textContent = 'Strong';
        strengthBadge.className = 'strength-badge strong';
        strengthFill.style.backgroundColor = '#10b981';
    }
}

function copyToClipboard() {
    const password = passwordDisplay.textContent;
    if (password === 'Click Generate To Create Password') return;

    const textarea = document.createElement('textarea');
    textarea.value = password;
    document.body.appendChild(textarea);

    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    copyNotification.classList.add('show');
    setTimeout(() => {
        copyNotification.classList.remove('show');
    }, 2000);

    const copyIcon = copyBtn.querySelector('i');
    copyIcon.className = 'fas fa-check';

    setTimeout(() => {
        copyIcon.className = 'fas fa-copy';
    }, 2000);
}

function createBubbles() {
    for (let i = 0; i < 5; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');

        const size = Math.random() * 35 + 15;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        bubble.style.left = `${Math.random() * 90 + 5}%`;

        const duration = Math.random() * 10 + 15;
        bubble.style.animationDuration = `${duration}s`;

        document.body.appendChild(bubble);

        setTimeout(() => {
            if (bubble.parentNode) document.body.removeChild(bubble);
        }, duration * 1000);
    }
}
