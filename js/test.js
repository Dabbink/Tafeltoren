// ===== Level Systeem =====
let level = 1;
let vraagNummer = 0;
let getalvanscore = 0;

// Level configuratie: [min getal, max getal]
const levelConfig = [
    { min: 1, max: 5,  naam: "Beginner" },       // Level 1
    { min: 1, max: 10, naam: "Leerling" },        // Level 2
    { min: 2, max: 12, naam: "Gevorderd" },       // Level 3
    { min: 5, max: 15, naam: "Expert" },           // Level 4
    { min: 10, max: 20, naam: "Meester" },         // Level 5
    { min: 10, max: 25, naam: "Kampioen" },        // Level 6
    { min: 15, max: 30, naam: "Legende" },         // Level 7
];

// DOM elementen
const vraag = document.getElementById('vraag');
const antwoord = document.getElementById('number');
const num1 = document.getElementById('getal1');
const num2 = document.getElementById('getal2');
const xoperator = document.getElementById('op');
const score = document.getElementById('score');
const levelDisplay = document.getElementById('level-display');
const levelNaam = document.getElementById('level-naam');
const progressBar = document.getElementById('progress-fill');
const vraagTeller = document.getElementById('vraag-teller');
const timer = document.getElementById('timer');

// Huidig level config ophalen
function getLevelConfig() {
    const idx = Math.min(level - 1, levelConfig.length - 1);
    return levelConfig[idx];
}

// Random getal genereren op basis van level
function randomGetal() {
    const config = getLevelConfig();
    return Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
}

// UI updaten voor level
function updateLevelUI() {
    const config = getLevelConfig();
    if (levelDisplay) levelDisplay.textContent = "Level " + level;
    if (levelNaam) levelNaam.textContent = config.naam;
    if (vraagTeller) vraagTeller.textContent = (vraagNummer % 10) + " / 10";
    if (progressBar) {
        const percentage = ((vraagNummer % 10) / 10) * 100;
        progressBar.style.width = percentage + "%";
    }
}

// Level omhoog
function levelUp() {
    level++;
    updateLevelUI();

    // Level-up animatie
    const card = document.querySelector('.game-card');
    if (card) {
        card.classList.add('level-up-flash');
        setTimeout(() => card.classList.remove('level-up-flash'), 1200);
    }

    // Level-up melding tonen
    const overlay = document.getElementById('level-up-overlay');
    if (overlay) {
        const config = getLevelConfig();
        document.getElementById('level-up-text').textContent = "Level " + level;
        document.getElementById('level-up-naam').textContent = config.naam;
        overlay.classList.add('show');
        setTimeout(() => overlay.classList.remove('show'), 2500);
    }
}

// Eerste getallen genereren
let keergetal1 = randomGetal();
num1.innerHTML = keergetal1;
let keergetal2 = randomGetal();
num2.innerHTML = keergetal2;
updateLevelUI();

// Enter-toets om antwoord te controleren
antwoord.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        controleerAntwoord();
    }
});

function question() {
    // Nieuwe getallen op basis van level
    keergetal1 = randomGetal();
    num1.innerHTML = keergetal1;
    keergetal2 = randomGetal();
    num2.innerHTML = keergetal2;
    antwoord.value = "";
    antwoord.focus();

    // Animatie op de getallen
    num1.style.animation = 'none';
    num2.style.animation = 'none';
    setTimeout(() => {
        num1.style.animation = 'popIn 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
        num2.style.animation = 'popIn 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
    }, 10);

    updateLevelUI();
}

function controleerAntwoord() {
    let answer = Number(antwoord.value);
    let juisteantwoord = keergetal1 * keergetal2;

    if (answer === juisteantwoord) {
        // Goed antwoord
        getalvanscore++;
        vraagNummer++;
        score.innerHTML = "⭐ Score: " + getalvanscore;

        // Visuele feedback: groen
        antwoord.classList.add('correct-flash');
        setTimeout(() => antwoord.classList.remove('correct-flash'), 600);

        // Check of we naar volgend level gaan
        if (vraagNummer % 10 === 0 && vraagNummer > 0) {
            levelUp();
            setTimeout(() => question(), 2600);
        } else {
            setTimeout(() => question(), 700);
        }
    } else {
        // Fout antwoord - rode shake
        antwoord.classList.add('incorrect-shake');

        // Toon het juiste antwoord
        const antwoordSpan = document.getElementById('antwoord');
        if (antwoordSpan) {
            antwoordSpan.textContent = juisteantwoord;
            antwoordSpan.style.color = '#ff5252';
            setTimeout(() => {
                antwoordSpan.textContent = '?';
                antwoordSpan.style.color = '';
            }, 1500);
        }

        setTimeout(() => antwoord.classList.remove('incorrect-shake'), 500);
    }
}

function empty() {

}