const messageDisplay = document.querySelector('#message');
const num1Display = document.querySelector('#num1');
const num2Display = document.querySelector('#num2');
const guessDisplay = document.querySelector('#guess');

const startButton = document.querySelector('.mainScreen > .start');
const settingsButton = document.querySelector('.mainScreen > .settings');
const gameQuitButton = document.querySelector('.gameBoard > .quit');
const settingsBackButton = document.querySelector('.settingsScreen > .back');
const resultsStartButton = document.querySelector('.resultsScreen > .start');
const resultsBackButton = document.querySelector('.resultsScreen > .back');


const divGameBoard = document.querySelector('.gameBoard');
const divMainScreen = document.querySelector('.mainScreen');
const divSettingsScreen = document.querySelector('.settingsScreen');
const divResultsScreen = document.querySelector('.resultsScreen');

const inputMaxQuestion = document.querySelector('#chooseQuestionCount');

let ignoreNumSpan = document.querySelectorAll('.displayIgnoreNum span');
let operatorSelect = document.querySelectorAll('.displayOperators span');
let operatorArray = ["+"];
let ignoreNum = [];
let guessArray = [];
let highScoreArray = [];
let practiceNumValue;
let solution
let timeStart
let timeCurrent
let timeMax
let questionCurrent
let questionMax

ignoreNumSpan.forEach(function (item){
   item.addEventListener('click', function(event){
    event.target.classList.toggle('selectedNum');

    //add or remove from variable array
    let btnValue = parseInt(event.target.innerText);
    if(!ignoreNum.includes(btnValue)){
        ignoreNum.push(btnValue);
    } else {
        ignoreNum.splice(ignoreNum.indexOf(btnValue), 1);
    }

   });
});

operatorSelect.forEach(function (item){
    item.addEventListener('click', function(event){
        event.target.classList.toggle('selectedNum');
        let operatorsSelected = event.target.innerText;
        if (!operatorArray.includes(operatorsSelected)){
            operatorArray.push(operatorsSelected);
        } else {
            operatorArray.splice(operatorArray.indexOf(operatorsSelected),1);
        }
    });
});

startButton.addEventListener('click', function(){
    divMainScreen.style.display = 'none';
    divGameBoard.style.display = 'flex';
    startGame()
});

settingsButton.addEventListener('click', function(){
    divMainScreen.style.display = 'none';
    divSettingsScreen.style.display = 'grid';
});

gameQuitButton.addEventListener('click', function(){
    divMainScreen.style.display = 'grid';
    divGameBoard.style.display = 'none';
});

settingsBackButton.addEventListener('click', function(){
    divMainScreen.style.display = 'grid';
    divSettingsScreen.style.display = 'none';
});

resultsStartButton.addEventListener('click', function () {
    divResultsScreen.style.display = 'none';
    divGameBoard.style.display = 'flex';
    startGame()
});

resultsBackButton.addEventListener('click', function () {
    divMainScreen.style.display = 'grid';
    divResultsScreen.style.display = 'none';
});

function startGame(){
    newGame()
    newRound()
}


function newGame(){
    questionCurrent = 0
    questionMax = parseInt(inputMaxQuestion.value)
    guessArray = []; //empty the array
    messageDisplay.textContent = 'Enter a guess'
    clearScreen()
}

function newRound(){
    
    let num1 = practiceNumValue || getRandomIntInclusive(1,9)
    let num2 = getRandomIntInclusive(1,9)
    solution = num1 + num2
    document.querySelector('#guess').focus()

    num1Display.textContent = num1
    num2Display.textContent = num2

    timeStart = Date.now()
}

function clearScreen() {
    guessDisplay.value = "";
    guessDisplay.innerText = "";
}

function display(value) {
    guessDisplay.value += value;
    guessDisplay.innerText += value;
}

function checkGuess() {    
    if(guessDisplay.value == solution){
        guessTime = ((Date.now() - timeStart) / 1000).toFixed(3);
        messageDisplay.textContent = 'Correct! ' + guessTime + 's'

        guessArray.push({ num1: parseInt(num1Display.innerText),
            num2: parseInt(num2Display.innerText),
            time: guessTime})
        //console.log(guessArray)
        questionCurrent++;
        
        if (questionCurrent >= questionMax){ //game over, show results
            console.log(guessArray)
            divGameBoard.style.display = 'none';
            showResultsScreen()
        } else{
        clearScreen()
        newRound()
        }
    }
    else {
        messageDisplay.textContent = 'Try again!'
        clearScreen()
    }
}

function getRoundTotalTime(){
    let time = 0;
    guessArray.forEach(function(item){
        time += parseFloat(item.time);
    });
    return time.toFixed(3);
}

//from mozilla
function getRandomIntInclusive(min, max) {
  //max and min are inclusive
  min = Math.ceil(min);
  max = Math.floor(max);
    let tempValue; 
    do{ tempValue = Math.floor(Math.random() * (max - min + 1) + min);
} while (ignoreNum.includes(tempValue));
  return tempValue;
}

//from codexworld.com -ish
//for keyboard ENTER
let input = document.querySelector('#guess');
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) { //keyCode 13 is Enter
        event.preventDefault();
        checkGuess();
    }
});

function showResultsScreen(){
    divResultsScreen.style.display = 'grid';
    let userTime = getRoundTotalTime()
    let perQuestionTime = (userTime / questionMax).toFixed(2);
    document.querySelector('.displayResultsTime').innerText = 'Your time: ' + userTime;
    document.querySelector('.displayResultsPerQuestion').innerText = 'Per question avg: ' + perQuestionTime;
}
