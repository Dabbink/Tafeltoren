# 📘 De Volledige Gids: Tafel.js van A tot Z

In dit document vind je de **volledige broncode** van `tafel.js`, opgesplitst in blokken met een duidelijke uitleg erbij. Zo begrijp je precies hoe elk onderdeel van jouw game werkt.

---

## Deel 1: De Variabelen (Het geheugen)
Hier leggen we vast welke informatie het spel moet onthouden.

```javascript
let level = 1;
let vraagNummer = 0;
let getalvanscore = 0;
let health = 3;
let timer = null;
let tijdOver = 20; // Startwaarde voor level 1
let antwoordControleren = false;
let magScoreKrijgen = false;
let keergetal1, keergetal2;
let foutePogingen = 0;
```

**Uitleg:**
- `level` tot `getalvanscore`: Jouw voortgang en punten.
- `timer`: Hier slaan we het "klokje" in op zodat we het kunnen stoppen.
- `foutePogingen`: Houdt bij hoe vaak je een fout antwoord geeft.
- `keergetal1 & 2`: De twee getallen die samen de som vormen (bijv. 3 en 4 voor 3x4).
- `antwoordControleren`: Een slotje dat voorkomt dat je kunt typen terwijl de game het goede antwoord laat zien.
- `health`: Je resterende levens.

---

## Deel 2: Level Configuratie
Hier bepalen we de moeilijkheidsgraad per level.

```javascript
// Level configuratie
const levelConfig = [
    { min: 1,  max: 10, tijd: 20, naam: "Beginner" },   // Tafels 1-10
    { min: 1,  max: 12, tijd: 20, naam: "Leerling" },   // Tafels 1-12
    { min: 5,  max: 15, tijd: 25, naam: "Gevorderd" },  // Net buiten tafels
    { min: 10, max: 20, tijd: 30, naam: "Expert" },      // Tientallen
    { min: 12, max: 25, tijd: 35, naam: "Meester" },     // Pittige sommen
    { min: 15, max: 40, tijd: 45, naam: "Kampioen" },    // Grote getallen
    { min: 20, max: 50, tijd: 60, naam: "Legende" },     // De ultieme uitdaging
];
```

**Uitleg:**
Elk level heeft nu drie belangrijke instellingen:
1. `min`/`max`: Voor de moeilijkheid van de sommen.
2. `tijd`: Hoeveel seconden de leerling krijgt. Bij moeilijkere sommen geven we meer tijd! ⏱️
3. `naam`: De titel van het level.
Hoe hoger het level, hoe groter de getallen.

---

## Deel 3: HTML Elementen Koppelen
De code moet weten waar de teksten en buttons staan in je browser.

```javascript
const antwoordInput = document.getElementById('number');
const num1 = document.getElementById('getal1');
const num2 = document.getElementById('getal2');
const timerEl = document.getElementById('timer');
const timerFill = document.getElementById('timer-fill');
const scoreEl = document.getElementById('score'); // De ster-score bovenin
const levelDisplay = document.getElementById('level-display'); // Toont Level en Naam samen
const progressBar = document.getElementById('progress-fill');
const vraagTeller = document.getElementById('vraag-teller');
const antwoordVraagteken = document.getElementById('antwoord');
const feedback = document.getElementById('feedback-tekst');
const heart = document.getElementById('health'); // De hartjes bovenin
```

**Uitleg:**
Met `document.getElementById` maken we een verbinding met de HTML. Als we in JS iets veranderen aan `scoreEl`, ziet de speler dat direct in het scorevakje.

---

## Deel 4: Hulpfuncties (Score & UI)
Kleine functies die specifieke taken uitvoeren.

```javascript
// Score verhogen
function verhoogScore() {
    getalvanscore++;
    scoreEl.textContent = "⭐ Score: " + getalvanscore;
}

// Instellingen van huidig level ophalen
function getLevelConfig() {
    return levelConfig[Math.min(level - 1, levelConfig.length - 1)];
}

// Een willekeurig getal kiezen op basis van level
function randomGetal() {
    const config = getLevelConfig();
    return Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
}

// Alle teksten op het scherm updaten
function updateLevelUI() {
    const config = getLevelConfig();

    // Zet het level nummer en de naam samen in één balkje
    levelDisplay.textContent = "Level " + level + " - " + config.naam;

    const teller = vraagNummer % 10;
    vraagTeller.textContent = "Vraag: " + teller + " / 10"; // Voeg label toe
    progressBar.style.width = (teller * 10) + "%";
}
```

---

## Deel 5: De Timer Logica
Dit regelt de spanning: de tikkende klok.

```javascript
// Timer starten
function startTimer() {
    clearInterval(timer); 
    const config = getLevelConfig(); 
    const totaleTijd = config.tijd || 30; // Hoeveel tijd hebben we in totaal?
    tijdOver = totaleTijd;    

    // Reset de balk naar 100%
    if (timerFill) {
        timerFill.classList.remove("low");
        timerFill.style.width = "100%";
    }
    
    timerEl.textContent = tijdOver + "s";

    timer = setInterval(() => {
        tijdOver--;
        timerEl.textContent = tijdOver + "s";

        // De balk visueel leger maken op basis van de tijd
        if (timerFill) {
            const percentage = (tijdOver / totaleTijd) * 100;
            timerFill.style.width = percentage + "%";
        }

        if (tijdOver <= 10) {
            timerEl.classList.add("low"); // Tekst wordt rgb(255, 0, 0)
            if (timerFill) timerFill.classList.add("low"); // Balk wordt rood
        }

        if (tijdOver <= 5) {
            timerEl.classList.add("blink"); // Tekst knippert 
            if (timerFill) timerFill.classList.add("blink"); // Balk knippert ook
        }

        if (tijdOver <= 0) {
            clearInterval(timer);
            tijdIsOp();
        }
    }, 1000);
}

// Wat gebeurt er als de tijd op is?
function tijdIsOp() {
    antwoordControleren = true;
    magScoreKrijgen = false;
    const goedeAntwoord = keergetal1 * keergetal2;
    antwoordVraagteken.textContent = goedeAntwoord;
    antwoordVraagteken.style.color = "#ffffff";
    feedback.textContent = "Tijd is om!";
    feedback.style.color = "#ff5252";
    antwoordInput.disabled = true;

    health--; // Straf: hartje minder
    updateHealthUI();

    if (health <= 0) {
        gameOver();
        return;
    }

    setTimeout(() => {
        vraagNummer++;
        (vraagNummer % 10 === 0) ? volgendeLevel() : volgendeVraag();
    }, 2000);
}
```

---

## Deel 6: Vragen Genereren
Het hart van de game-loop.

```javascript
function volgendeVraag() {
    if (health <= 0) return;

    antwoordControleren = false;
    foutePogingen = 0;
    magScoreKrijgen = true;

    keergetal1 = randomGetal();
    keergetal2 = randomGetal();

    num1.textContent = keergetal1;
    num2.textContent = keergetal2;

    antwoordInput.value = "";
    antwoordInput.disabled = false;
    antwoordInput.classList.remove("incorrect-shake", "correct-flash"); // Reset kleuren
    antwoordInput.style.borderColor = ""; 
    antwoordInput.focus();

    antwoordVraagteken.textContent = "?";
    antwoordVraagteken.style.color = "#ffffff";
    feedback.textContent = "";

    updateLevelUI();
    startTimer();
}
```

**Uitleg:**
Deze functie zet alles klaar voor een nieuwe ronde: nieuwe getallen kiezen, het invoerveld leegmaken en de timer weer aanzetten.

---

## Deel 7: Antwoorden Controleren
Dit gebeurt als je op Enter drukt.

```javascript
function controleerAntwoord() {
    if (antwoordControleren || antwoordInput.value.trim() === "") return;

    const input = antwoordInput.value.trim();
    const antwoord = Number(input);
    const goedeAntwoord = keergetal1 * keergetal2;

    if (antwoord === goedeAntwoord) {
        // Goede antwoord
        antwoordControleren = true;
        clearInterval(timer);
        verhoogScore();
        vraagNummer++;
        antwoordVraagteken.textContent = goedeAntwoord;
        antwoordVraagteken.style.color = "#00e676";
        feedback.textContent = "Goed zo!";
        feedback.style.color = "#00e676";
        antwoordInput.disabled = true;

        setTimeout(() => {
            (vraagNummer % 10 === 0) ? volgendeLevel() : volgendeVraag();
        }, 1200);

    } else {
        // Fout antwoord
        antwoordControleren = true; // Blokkeer verdere invoer
        clearInterval(timer);        // Zet de klok stil
        
        health--; // Haal een hartje weg
        magScoreKrijgen = false;
        updateHealthUI();
        
        // Laat het goede antwoord in het rood zien
        antwoordVraagteken.textContent = goedeAntwoord;
        antwoordVraagteken.style.color = "#ff5252";

        feedback.textContent = "Helaas, dat is niet goed!";
        feedback.style.color = "#ff5252";

        antwoordInput.classList.add("incorrect-shake");
        antwoordInput.disabled = true;

        if (health <= 0) {
            gameOver();
            return;
        }

        // Ga na een korte pauze automatisch naar de volgende vraag
        setTimeout(() => {
            vraagNummer++;
            (vraagNummer % 10 === 0) ? volgendeLevel() : volgendeVraag();
        }, 1200);
    }
}
```

---

## Deel 8: Level Overgang
Een feestelijk moment als je 10 vragen goed hebt.

```javascript
function volgendeLevel() {
    // Check of we al op level 7 zitten. levelConfig.length is namelijk 7.
    if (level >= levelConfig.length) {
        gameWin(); // Roep de win-functie aan
        return;     // Stop de functie hier
    }

    level++; // Ga naar het volgende level
    const overlay = document.getElementById('level-up-overlay');
    const config = getLevelConfig();

    if (overlay) {
        // Vul de teksten in de pop-up
        document.getElementById('level-omhoog-tekst').textContent = "Level " + level;
        document.getElementById('level-omhoog-naam').textContent = config.naam;

        overlay.classList.add('show'); // Laat de pop-up zien
        clearInterval(timer);         // Zet de klok even stil
    } else {
        volgendeVraag();
    }
}

// Wordt aangeroepen als de speler op de knop "Volgende Level" klikt
function sluitLevelOverlay() {
    const overlay = document.getElementById('level-up-overlay');
    if (overlay) {
        overlay.classList.remove('show'); // Haal de pop-up weg
    }
    volgendeVraag(); // Start de eerste vraag van het nieuwe level
}
```

### Winnen (`gameWin`)
```javascript
function gameWin() {
    antwoordControleren = true; 
    clearInterval(timer); // Zet de klok stil
    
    // Toon een overwinningsbericht en de knop om opnieuw te spelen
    feedback.innerHTML = '🎉 GEFELICITEERD! <br> Je hebt alle 7 levels voltooid! <br><button class="button" onclick="herstartSpel()">🔄 Nog een keer?</button>';
    feedback.style.color = "#00e676"; // Maak de tekst groen
    
    antwoordInput.disabled = true;
    antwoordInput.value = "WINNAAR!";
    heart.textContent = "🏆 GEWONNEN 🏆";
}
```

**Uitleg:**
Wanneer je de 10e vraag van Level 7 goed beantwoordt, wordt `volgendeLevel` aangeroepen. De code ziet dat je al op het maximale level zit en stuurt je door naar `gameWin`. Hierdoor kun je niet per ongeluk naar een Level 8 gaan dat niet bestaat.

---

## Deel 9: Health & Game Over (Het nieuwe systeem)
Zorgt voor levens, dood gaan en opnieuw kunnen starten.

```javascript
// Hartjes op het scherm tekenen
function updateHealthUI() {
    if (!heart) return;
    if (health > 0) {
        heart.textContent = "❤️".repeat(health);
        heart.style.color = ""; 
    } else {
        heart.textContent = "❌ Game Over";
        heart.style.color = "#ff5252";
    }
}

// Spel stilzetten als hartjes op zijn
function gameOver() {
    antwoordControleren = true;
    clearInterval(timer);
    feedback.innerHTML = 'Helaas, je hartjes zijn op! <br><button class="button" style="margin-top: 10px;" onclick="herstartSpel()">🔄 Opnieuw proberen</button>';
    feedback.style.color = "#ff5252";
    antwoordInput.disabled = true;
    antwoordInput.value = "GAME OVER";
}

// Alles resetten naar Level 1
function herstartSpel() {
    level = 1;
    vraagNummer = 0;
    getalvanscore = 0;
    health = 3;
    tijdOver = 30;
    antwoordControleren = false;
    
    scoreEl.textContent = "⭐ Score: 0";
    antwoordInput.disabled = false;
    antwoordInput.value = "";
    feedback.innerHTML = "";
    
    updateHealthUI();
    updateLevelUI();
    volgendeVraag();
}
```

---

## Deel 10: De Motor Starten
Hoe het spel begint als je de pagina laadt.

```javascript
// Enter toets zorgt voor controle
antwoordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') controleerAntwoord();
});

// Initialiseer hartjes en de eerste vraag
updateHealthUI();
volgendeVraag();
```

> [!NOTE]
> Elk stukje code dat je hier ziet, vormt samen de volledige `js/tafel.js`. Door dit in blokken te verdelen en functies namen te geven als `volgendeVraag`, blijft de code leesbaar en makkelijk uit te leggen aan anderen!