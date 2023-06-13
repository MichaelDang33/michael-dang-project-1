/*----- constants -----*/
const answerBank =  [
    "CEREAL",
    "TOFU",
    "PIZZA",
    "HAMBURGER",
    "NOODLES"
];

const validLetters = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" 
];

/*----- cached elements  -----*/

let docGeneratedWord = document.getElementById("docGeneratedWord");
let docLetterContainer = document.getElementById("docLetterContainer");
let docHangmanDisplay = document.getElementById("docHangmanDisplay");
let docMsgPrompt = document.getElementById("docMsgPrompt");

/*----- state variables -----*/

let generatedWord = getGeneratedWord();
let userGuessInput = [];
let endResult = false;

/*----- event listeners -----*/
window.onload = function () {
    renderGeneratedWord();  
}

window.onkeydown = function(event) {
  processUserInput(event.key.toUpperCase());
}

/*----- functions -----*/

function startNewGame() {
  generatedWord = getGeneratedWord();
  userGuessInput = [];
  endResult = false;
  render("Your category for the generated word is 'FOOD'!");
}

function processUserInput(userInput) {
  // checks to see if endResult was met, if so, then it will lock the game out so that it won't let you continue trying.
  if (!endResult) {
  // Need to check whether or not the input is valid AND if it hasn't been already guessed. 
      if ( (validLetters.includes(userInput)) && (!userGuessInput.includes(userInput)) ) {
        userGuessInput.push(userInput); // then we will be able to push the letter into the userGuessInput array
        render("Your category for the generated word is 'FOOD'!");
        console.log(userGuessInput);
        // Checking win or lose condition
        if (userGuessIncorrect() == 6) {
          endResult = true;
          render("Aww, you've run out of guesses! You lose! Try again? Press [esc] to start a new game!");
        } else if (checkWinCondition()) {
          endResult = true;
          render("You're a genius! You win! Try your luck again by pressing [esc] to start a new game!");
        } else {
          render ("Use these letters to try and guess your word(s)!");
        } 
    }
  } else if (userInput == "ESCAPE") {
      startNewGame();
  }
}



function render(msg) {
  renderLetterBank();
  renderGeneratedWord();
  renderHangmanDisplay();
  renderMsgPrompt(msg);
}

function renderMsgPrompt(msg) {
  docMsgPrompt.innerHTML = msg;
}

function renderHangmanDisplay() {
  let numIncorrectGuesses = userGuessIncorrect();
  docHangmanDisplay.style.backgroundImage = "url('images/hangman5.jpg')"
}

function renderLetterBank() {
    // clears the current state of the docLetterContainer since render() invokes renderLetterBank() which will continually add spans otherwise
  docLetterContainer.innerHTML = "";
    // loop through every letter in validLetters
  for (let i = 0; i < validLetters.length; i++) {
    let thisLetter = validLetters[i];
    let thisSpan = document.createElement("span"); // create a span element for each letter
    thisSpan.classList.add("letter");
    thisSpan.innerHTML = thisLetter;
    // checks to see if the user has chose a validLetter and if so, adds the class "dim" to it.
    if (userGuessInput.includes(thisLetter)) {
      thisSpan.classList.add("dim");
    } else {
        thisSpan.onclick = function () {
          processUserInput(thisLetter);
        }
    }
    
    docLetterContainer.appendChild(thisSpan);
    // Stylistic function in order to add an empty <span> inbetween the "U" and "V" letters.
    if (thisLetter == "U") {
      let thisSpan = document.createElement("span");
      docLetterContainer.appendChild(thisSpan);
    }
  }
  // if the game is over, add a span to reset and start a new game
  if (endResult) {
    let thisSpan = document.createElement("span");
    thisSpan.classList.add("escape");
    thisSpan.innerHTML = "esc";
    thisSpan.onclick = function () {
      startNewGame();
    };
    docLetterContainer.appendChild(thisSpan);
  }
}

function renderGeneratedWord() {
    let tempString = "";
    for (let i = 0; i < generatedWord.length; i++) {
      let thisLetter = generatedWord[i];
      if (userGuessInput.includes(thisLetter)) {
        tempString += thisLetter;
      } else if (!validLetters.includes(thisLetter)) {
          tempString += thisLetter;
      } else {
          tempString += "_";
      }
    }
    docGeneratedWord.innerHTML = tempString;
}

function userGuessIncorrect() {
  let count = 0;
  // loop through the letters guessed
  for (let i = 0; i < userGuessInput.length; i++) {
    let thisLetter = userGuessInput[i];
    // if this letter is not in the generated word, increase the count
    if (!generatedWord.includes(thisLetter)) {
      count++;
    }
  }
  if (count > 6) { // if method to not let count go past 7 and ensure 
    count = 6;
  }
  return count;
}

function checkWinCondition () {
  // loop through every letter of the generated word
  for (let i = 0; i < generatedWord.length; i++) {
    let thisLetter = generatedWord[i];
    // the letter MUST be a valid letter AND it must not have been guessed yet
    if ((validLetters.includes(thisLetter)) && (!userGuessInput.includes(thisLetter))) {
      return false;
    }
  }
  return true;
}

function getGeneratedWord() {
  let randomIndex = getRndInteger(0, answerBank.length-1);
  return answerBank[randomIndex];
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}