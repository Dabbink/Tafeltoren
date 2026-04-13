// let startgame ;
// let play = document.getElementById("tafel-container");

const vraag = document.getElementById('vraag')
const antwoord = document.getElementById('number')
//vraag.innerHTML= "Hoi Ids"
const num1 = document.getElementById('getal1')

let keergetal1 = Math.floor(Math.random() * 10);
num1.innerHTML = keergetal1;

const xoperator = document.getElementById('op')
const num2 = document.getElementById('getal2')

let keergetal2 = Math.floor(Math.random() * 10);
num2.innerHTML = keergetal2;

// let Optie1 = document.getElementById('optie1')
// let Optie2 = document.getElementById('optie2')
// let Optie3 = document.getElementById('optie3')
// let Optie4 = document.getElementById('optie4')

let Controleer = document.getElementById('controleer')
let vorigeVraag = document.getElementById('vorigeVraag')
let volgendeVraag = document.getElementById('volgendeVraag')
let reset = document.getElementById('reset')
let pauze = document.getElementById('pauze')
let vraagOpslaan = document.getElementById('vraagOpslaan')
let score = document.getElementById('score')
let getalvanscore = 0

function question () {
//de inhoud van getal1 vervangen door een nieuw random getal
keergetal1 = Math.floor(Math.random() * 10);
num1.innerHTML = keergetal1;
//de inhoud van getal2 vervangen door een nieuw random getal
keergetal2 = Math.floor(Math.random() * 10);
num2.innerHTML = keergetal2;
//de inhoud van het antwoord leegmaken
antwoord.value = "";



//let vraagMaker = document.getElementById('vraagMaker')
    
}
function controleerAntwoord()
{
    let answer = Number(antwoord.value)
    let juisteantwoord = keergetal1 * keergetal2
    if(answer === juisteantwoord){
        //alert("HOERA ")
        getalvanscore++
        score.innerHTML = "score: " + getalvanscore
    }
    else {
        alert("FOUT! Juiste antwoord = " + juisteantwoord)
    }
    question()
}

function empty()
{
    
}