const copyBtn = document.getElementById('copyBtn');
const exportBtn = document.getElementById('exportBtn');
const refreshBtn = document.getElementById('refreshBtn');
const generateBtn = document.getElementById('generateBtn');
const themeToggle = document.getElementById('themeToggle');
const passwordDisplay = document.getElementById('passwordDisplay');
const copyNotification = document.getElementById('copyNotification');

const lengthValue = document.getElementById('lengthValue');
const lengthSlider = document.getElementById('lengthSlider');

const autoGenOption = document.getElementById('autoGenOption');
const numbersOption = document.getElementById('numbersOption');
const symbolsOption = document.getElementById('symbolsOption');
const similarOption = document.getElementById('similarOption');
const advancedToggle = document.getElementById('advancedToggle');
const uppercaseOption = document.getElementById('uppercaseOption');
const lowercaseOption = document.getElementById('lowercaseOption');
const ambiguousOption = document.getElementById('ambiguousOption');
const easyToSayOption = document.getElementById('easyToSayOption');
const advancedOptions = document.getElementById('advancedOptions');

const strengthFill = document.getElementById('strengthFill');
const strengthInfo = document.getElementById('strengthInfo');
const strengthBadge = document.getElementById('strengthBadge');
const strengthDetail = document.getElementById('strengthDetail');
const strengthDetailInfo = document.getElementById('strengthDetailInfo');

const historyList = document.getElementById('historyList');
const historySection = document.getElementById('historySection');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const historyToggleBtn = document.getElementById('historyToggleBtn');

const multiPasswordBtn = document.getElementById('multiPasswordBtn');
const passwordQuantity = document.getElementById('passwordQuantity');
const generateMultiBtn = document.getElementById('generateMultiBtn');
const decreaseQuantityBtn = document.getElementById('decreaseQuantity');
const increaseQuantityBtn = document.getElementById('increaseQuantity');
const multiPasswordSection = document.getElementById('multiPasswordSection');
const multiPasswordResults = document.getElementById('multiPasswordResults');

const toggleTipsText = document.getElementById('toggleTipsText');
const toggleTipsIcon = document.getElementById('toggleTipsIcon');
const toggleSecurityTips = document.getElementById('toggleSecurityTips');
const securityTipsContainer = document.getElementById('securityTipsContainer');

const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '0123456789';
const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/';
const similarChars = 'il1Lo0O';
const ambiguousChars = '{}[]()/\\\'"`~,;:.<>';
const vowels = 'aeiouAEIOU';

let passwordHistory = JSON.parse(localStorage.getItem('passwordHistory')) || [];
const MAX_HISTORY = 10;

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }

    updateSliderValue();
    generatePassword();
    createBubbles();

    setInterval(createBubbles, 3000);
    updateHistoryList();

    const tipItems = securityTipsContainer.querySelectorAll('.tip-item');
    for (let i = 1; i < tipItems.length; i++) {
        tipItems[i].style.display = 'none';
    }
    toggleTipsText.textContent = 'Show More Tips';
    toggleTipsIcon.className = 'fas fa-chevron-down';
});

lengthSlider.addEventListener('input', () => {
    updateSliderValue();
    if (autoGenOption.checked) generatePassword();
});

[uppercaseOption, lowercaseOption, numbersOption, symbolsOption, 
 similarOption, ambiguousOption, easyToSayOption].forEach(option => {
    option.addEventListener('change', () => {
        if (autoGenOption.checked) generatePassword();
    });
});

advancedToggle.addEventListener('change', () => {
    advancedOptions.style.display = advancedToggle.checked ? 'block' : 'none';
});

copyBtn.addEventListener('click', copyToClipboard);
refreshBtn.addEventListener('click', generatePassword);

generateBtn.addEventListener('click', () => {
    generateBtn.classList.add('generating');
    generateBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Generating';

    setTimeout(() => {
        generatePassword();
        generateBtn.classList.remove('generating');
        generateBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Generate Password';
    }, 250);
});

themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
});

historyToggleBtn.addEventListener('click', () => {
    historySection.style.display = historySection.style.display === 'none' ? 'block' : 'none';
    if (historySection.style.display === 'block') {
        updateHistoryList();
    }
});

clearHistoryBtn.addEventListener('click', () => {
    passwordHistory = [];
    localStorage.removeItem('passwordHistory');
    updateHistoryList();
});

multiPasswordBtn.addEventListener('click', () => {
    multiPasswordSection.style.display = multiPasswordSection.style.display === 'none' ? 'block' : 'none';
});

decreaseQuantityBtn.addEventListener('click', () => {
    const currentValue = parseInt(passwordQuantity.value);
    if (currentValue > 2) {
        passwordQuantity.value = currentValue - 1;
    }
});

increaseQuantityBtn.addEventListener('click', () => {
    const currentValue = parseInt(passwordQuantity.value);
    if (currentValue < 10) {
        passwordQuantity.value = currentValue + 1;
    }
});

generateMultiBtn.addEventListener('click', () => {
    const quantity = parseInt(passwordQuantity.value);
    const passwords = [];

    for (let i = 0; i < quantity; i++) {
        passwords.push(generatePasswordString());
    }

    displayMultiplePasswords(passwords);
});

exportBtn.addEventListener('click', exportPasswords);

toggleSecurityTips.addEventListener('click', () => {
    const content = securityTipsContainer.querySelector('.content');
    const tipItems = content.querySelectorAll('.tip-item');

    for (let i = 1; i < tipItems.length; i++) {
        tipItems[i].style.display = tipItems[i].style.display === 'none' ? 'flex' : 'none';
    }

    if (tipItems[1].style.display === 'none') {
        toggleTipsText.textContent = 'Show More Tips';
        toggleTipsIcon.className = 'fas fa-chevron-down';
    } else {
        toggleTipsText.textContent = 'Hide Tips';
        toggleTipsIcon.className = 'fas fa-chevron-up';
    }
});

function updateSliderValue() {
    lengthValue.textContent = lengthSlider.value;
}

function generatePassword() {
    const password = generatePasswordString();

    passwordDisplay.textContent = password;
    updatePasswordStrength(password);
    addToHistory(password);

    return password;
}

function generatePasswordString() {
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

    if (easyToSayOption && easyToSayOption.checked) {
        chars = chars.replace(/[0-9]/g, '');
        chars = chars.replace(/[^\w\s]/g, '');

        for (let char of vowels) {
            if (chars.indexOf(char) === -1) {
                chars += char;
            }
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

    return password;
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
    let feedbackText = '';

    const length = password.length;
    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    if (length >= 20) score += 1;
    if (length >= 24) score += 1;

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^A-Za-z0-9]/.test(password);

    if (hasUppercase) score += 1;
    if (hasLowercase) score += 1;
    if (hasNumbers) score += 1;
    if (hasSymbols) score += 1;

    const percentage = (score / 9) * 100;
    strengthFill.style.width = `${percentage}%`;

    if (score < 3) {
        strengthBadge.textContent = 'Weak';
        strengthBadge.className = 'strength-badge weak';
        strengthFill.style.backgroundColor = '#ef4444';
        feedbackText = 'Your password is weak and could be vulnerable to brute force attacks.';
    } else if (score < 6) {
        strengthBadge.textContent = 'Medium';
        strengthBadge.className = 'strength-badge medium';
        strengthFill.style.backgroundColor = '#f59e0b';
        feedbackText = 'Your password has moderate strength but could be improved.';
    } else {
        strengthBadge.textContent = 'Strong';
        strengthBadge.className = 'strength-badge strong';
        strengthFill.style.backgroundColor = '#10b981';
        feedbackText = 'Your password is strong and provides good security.';
    }

    strengthDetail.textContent = feedbackText;
    strengthInfo.style.display = 'block';
}

function copyToClipboard() {
    const password = passwordDisplay.textContent;
    if (password === 'Click Generate Password') return;

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

function addToHistory(password) {
    if (password === 'Click Generate Password' || 
        passwordHistory.includes(password)) return;

    passwordHistory.unshift(password);

    if (passwordHistory.length > MAX_HISTORY) {
        passwordHistory = passwordHistory.slice(0, MAX_HISTORY);
    }

    localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
    if (historySection.style.display === 'block') updateHistoryList();
}

function updateHistoryList() {
    historyList.innerHTML = '';

    if (passwordHistory.length === 0) {
        const emptyItem = document.createElement('div');
        emptyItem.className = 'history-item';
        emptyItem.innerHTML = '<span>No Password History Available</span>';
        historyList.appendChild(emptyItem);
        return;
    }

    passwordHistory.forEach((password, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';

        const passwordSpan = document.createElement('span');
        passwordSpan.className = 'history-password';
        passwordSpan.textContent = password;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'history-actions';

        const copyButton = document.createElement('button');
        copyButton.className = 'history-btn';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.title = 'Copy Password';

        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(password).then(() => {
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                }, 1000);
            });
        });

        const useButton = document.createElement('button');
        useButton.className = 'history-btn';
        useButton.innerHTML = '<i class="fas fa-redo-alt"></i>';
        useButton.title = 'Use This Password';

        useButton.addEventListener('click', () => {
            passwordDisplay.textContent = password;
            updatePasswordStrength(password);
        });

        actionsDiv.appendChild(copyButton);
        actionsDiv.appendChild(useButton);

        historyItem.appendChild(passwordSpan);
        historyItem.appendChild(actionsDiv);

        historyList.appendChild(historyItem);
    });
}

function displayMultiplePasswords(passwords) {
    multiPasswordResults.innerHTML = '';
    multiPasswordResults.style.display = 'block';

    passwords.forEach((password, index) => {
        const passwordItem = document.createElement('div');
        passwordItem.className = 'multi-password-item';

        const indexSpan = document.createElement('span');
        indexSpan.className = 'multi-password-index';
        indexSpan.textContent = `${index + 1}.`;

        const passwordSpan = document.createElement('span');
        passwordSpan.className = 'multi-password-text';
        passwordSpan.textContent = password;

        const copyButton = document.createElement('button');
        copyButton.className = 'history-btn';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';

        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(password).then(() => {
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                }, 1000);
            });
        });

        passwordItem.appendChild(indexSpan);
        passwordItem.appendChild(passwordSpan);
        passwordItem.appendChild(copyButton);

        multiPasswordResults.appendChild(passwordItem);
    });
}

function exportPasswords() {
    let content = "# SNATEV Password Generator Export\n\n";

    if (passwordHistory.length > 0) {
        content += "## Password History\n\n";
        passwordHistory.forEach((password, index) => {
            content += `${index + 1}. ${password}\n`;
        });
    }

    const currentPassword = passwordDisplay.textContent;
    if (currentPassword !== 'Click Generate Password') {
        content += "\n## Current Password\n\n";
        content += currentPassword + "\n";
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'snatev-passwords.txt';
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}
