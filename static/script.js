let copyBtn;
let refreshBtn;
let generateBtn;
let passwordDisplay;
let copyNotification;

let lengthValue;
let lengthSlider;

let uppercaseOption;
let lowercaseOption;
let numbersOption;
let symbolsOption;
let similarOption;
let ambiguousOption;
let easyToSayOption;
let autoGenOption;

let strengthBadge;
let strengthDetail;
let strengthSegs;
let footerYear;

const UPPER    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER    = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS  = '0123456789';
const SYMBOLS  = '!@#$%^&*()_+-=[]{}|;:,.<>?/';
const SIMILAR  = 'il1Lo0O';
const AMBIGUOUS = '{}[]()/\\\'"`~,;:.<>';
const VOWELS   = 'aeiouAEIOU';

const STRENGTH_LEVELS = [
    { label: '-',         cls: '',        detail: 'Generate a password to see its strength.' },
    { label: 'Very Weak', cls: 'level-1', detail: 'Very easy to crack. Add more length and variety.' },
    { label: 'Weak',      cls: 'level-2', detail: 'Vulnerable to brute force. Try making it longer.' },
    { label: 'Fair',      cls: 'level-3', detail: 'Passable but could be stronger.' },
    { label: 'Good',      cls: 'level-4', detail: 'Good password. Add symbols for extra security.' },
    { label: 'Strong',    cls: 'level-5', detail: 'Excellent! This password is highly secure.' },
];

let isInitialized = false;

function initApp() {
    if (isInitialized) return;

    copyBtn = document.getElementById('copyBtn');
    refreshBtn = document.getElementById('refreshBtn');
    generateBtn = document.getElementById('generateBtn');
    passwordDisplay = document.getElementById('passwordDisplay');
    copyNotification = document.getElementById('copyNotification');

    lengthValue = document.getElementById('lengthValue');
    lengthSlider = document.getElementById('lengthSlider');

    uppercaseOption = document.getElementById('uppercaseOption');
    lowercaseOption = document.getElementById('lowercaseOption');
    numbersOption = document.getElementById('numbersOption');
    symbolsOption = document.getElementById('symbolsOption');
    similarOption = document.getElementById('similarOption');
    ambiguousOption = document.getElementById('ambiguousOption');
    easyToSayOption = document.getElementById('easyToSayOption');
    autoGenOption = document.getElementById('autoGenOption');

    strengthBadge = document.getElementById('strengthBadge');
    strengthDetail = document.getElementById('strengthDetail');
    strengthSegs = document.getElementById('strengthSegs');
    footerYear = document.getElementById('footerYear');

    const requiredElements = {
        copyBtn,
        refreshBtn,
        generateBtn,
        passwordDisplay,
        copyNotification,
        lengthValue,
        lengthSlider,
        uppercaseOption,
        lowercaseOption,
        numbersOption,
        symbolsOption,
        similarOption,
        ambiguousOption,
        easyToSayOption,
        autoGenOption,
        strengthBadge,
        strengthDetail,
        strengthSegs,
    };

    const missing = Object.entries(requiredElements)
        .filter(([, element]) => !element)
        .map(([name]) => name);

    if (missing.length) {
        console.error('Password generator init failed. Missing DOM elements:', missing.join(', '));
        return;
    }
    isInitialized = true;

    if (footerYear) footerYear.textContent = String(new Date().getFullYear());
    updateSliderBackground();
    generatePassword();

    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
        updateSliderBackground();
        if (autoGenOption && autoGenOption.checked) generatePassword();
    });

    [uppercaseOption, lowercaseOption, numbersOption, symbolsOption,
    similarOption, ambiguousOption, easyToSayOption, autoGenOption].forEach(opt => {
        if (!opt) return;
        opt.addEventListener('change', () => {
            if (autoGenOption && autoGenOption.checked) generatePassword();
        });
    });

    copyBtn.addEventListener('click', copyToClipboard);
    refreshBtn.addEventListener('click', generatePassword);

    generateBtn.addEventListener('click', () => {
        generateBtn.classList.add('generating');
        generateBtn.innerHTML = '<i class="fas fa-arrows-rotate"></i> Generating…';

        setTimeout(() => {
            generatePassword();
            generateBtn.classList.remove('generating');
            generateBtn.innerHTML = '<i class="fas fa-bolt"></i> Generate Password';
        }, 260);
    });
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

function updateSliderBackground() {
    const min = +lengthSlider.min;
    const max = +lengthSlider.max;
    const val = +lengthSlider.value;
    const pct = ((val - min) / (max - min)) * 100;
    lengthSlider.style.background =
    `linear-gradient(90deg, #6f7785 ${pct}%, rgba(255,255,255,0.08) ${pct}%)`;
}


function generatePassword() {
    const pwd = buildPassword();
    passwordDisplay.textContent = pwd;
    updateStrength(pwd);
}

function buildPassword() {
    if (!uppercaseOption.checked && !lowercaseOption.checked &&
        !numbersOption.checked   && !symbolsOption.checked) {
        lowercaseOption.checked = true;
    }

    let pool = '';
    if (uppercaseOption.checked) pool += UPPER;
    if (lowercaseOption.checked) pool += LOWER;
    if (numbersOption.checked)   pool += NUMBERS;
    if (symbolsOption.checked)   pool += SYMBOLS;

    if (similarOption && similarOption.checked) {
        for (const c of SIMILAR) pool = pool.split(c).join('');
    }
    if (ambiguousOption && ambiguousOption.checked) {
        for (const c of AMBIGUOUS) pool = pool.split(c).join('');
    }

    if (easyToSayOption && easyToSayOption.checked) {
        pool = pool.replace(/[0-9]/g, '').replace(/[^\w]/g, '');
        for (const v of VOWELS) {
            if (!pool.includes(v)) pool += v;
        }
    }

    if (!pool) pool = LOWER;
    const len = parseInt(lengthSlider.value);
    let pwd = '';

    if (uppercaseOption.checked && UPPER.split('').some(c => pool.includes(c)))
        pwd += randChar(UPPER.split('').filter(c => pool.includes(c)).join(''));
    if (lowercaseOption.checked && LOWER.split('').some(c => pool.includes(c)))
        pwd += randChar(LOWER.split('').filter(c => pool.includes(c)).join(''));
    if (numbersOption.checked  && NUMBERS.split('').some(c => pool.includes(c)))
        pwd += randChar(NUMBERS.split('').filter(c => pool.includes(c)).join(''));
    if (symbolsOption.checked  && SYMBOLS.split('').some(c => pool.includes(c)))
        pwd += randChar(SYMBOLS.split('').filter(c => pool.includes(c)).join(''));

    while (pwd.length < len) pwd += randChar(pool);
    return shuffle(pwd).slice(0, len);
}

function randChar(str) {
    return str.charAt(Math.floor(Math.random() * str.length));
}

function shuffle(str) {
    const a = str.split('');

    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }

    return a.join('');
}

function updateStrength(pwd) {
    if (!strengthSegs || !strengthBadge || !strengthDetail) return;

    let score = 0;
    const len = pwd.length;

    if (len >= 8)  score++;
    if (len >= 12) score++;
    if (len >= 16) score++;
    if (len >= 20) score++;
    if (len >= 24) score++;

    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    const level = score === 0 ? 1
                : score <= 2  ? 1
                : score <= 4  ? 2
                : score <= 5  ? 3
                : score <= 7  ? 4
                : 5;

    const info = STRENGTH_LEVELS[level];

    strengthBadge.textContent = info.label;
    strengthBadge.className = `strength-badge ${info.cls}`;
    strengthDetail.textContent = info.detail;

    const segs = strengthSegs.querySelectorAll('.seg');
    segs.forEach((seg, i) => {
        seg.className = 'seg';
        if (i < level) seg.classList.add(info.cls);
    });
}

function copyToClipboard() {
    const pwd = passwordDisplay.textContent;
    if (!pwd || pwd === 'Click Generate') return;

    if (navigator.clipboard) navigator.clipboard.writeText(pwd);
    else {
        const ta = document.createElement('textarea');
        ta.value = pwd;

        document.body.appendChild(ta);
        ta.select();

        document.execCommand('copy');
        document.body.removeChild(ta);
    }

    copyNotification.classList.add('show');
    const icon = copyBtn.querySelector('i');
    icon.className = 'fas fa-check';

    setTimeout(() => {
        copyNotification.classList.remove('show');
        icon.className = 'fas fa-copy';
    }, 1800);
}
