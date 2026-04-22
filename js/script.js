const playgameBtn = document.getElementById("playGame-btn");
const vraag = document.getElementById("vraag");
const antwoord = document.getElementById("antwoord");
const submitBtn = document.getElementById("submit-btn");
const vraagMaker = document.getElementById("vraagMaker");
const score = document.getElementById("score");
const timer = document.getElementById("timer");

let pgb = document.querySelector("#pgb");

playgameBtn.addEventListener("click", () => {
  vraagMaker();
});
