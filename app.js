const currentQuestionDisplay = document.getElementById('currentQuestion')
const totalQuestionsCountDisplay = document.getElementById('totalQuestionsCount')
const messageDisplay = document.querySelector('#message');
const num1Display = document.querySelector('#num1');
const num2Display = document.querySelector('#num2');
const operatorDisplay = document.getElementById('displayOperator')
const guessDisplay = document.getElementById('guess');
const displayTime = document.getElementById('displayTime');
const settingsTime = document.getElementById('chooseTime');

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
let operatorSelect = document.querySelectorAll('.displayOperators');
let operatorArray = ["+"];
let ignoreNumArray = [];
let guessArray = [];
let highScoreArray = [];
let practiceNumValue;
let solution
let timeStart
let timeCurrent
let timeMax
let questionCurrent
let questionMax
let timer;
let timeCounter;

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
    clearInterval(timer);
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

function getIgnoredNumsArray(){
    let ignoreNumAll = document.getElementsByName('ignoreNum');
    let output = []
    for(var i = 0; i< ignoreNumAll.length; i++){
        if(ignoreNumAll[i].checked){
            output.push(parseInt(ignoreNumAll[i].value))
        }
    }
    return output;
}

function newGame(){
    //timer operations
    timeCounter = parseInt(settingsTime.value) || 30
    renderTime()
    timer = setInterval(renderTime,1000)
    operatorArray = getOperatorArray()
    ignoreNumArray = getIgnoredNumsArray()
    practiceNumValue = document.getElementById('practiceNum').value;
    questionCurrent = 0
    questionMax = parseInt(inputMaxQuestion.value)
    guessArray = []; //empty the array
    messageDisplay.textContent = 'Enter a guess'
    clearScreen()
}

function getOperatorArray(){
    if (operatorArray.length <= 0) {
        operatorSelect[0].classList.add('selectedNum')
        let operatorDisplay = document.getElementsByClassName('displayOperators')
        return ["+"]
    } else {
        return operatorArray
    }
}

function renderTime(){
    if(timeCounter > 0){
        displayTime.innerText = timeCounter--;
    } else {
        timeCounter = 0;
        displayTime.innerText = timeCounter;
        messageDisplay.innerText = "Game Over";
        clearInterval(timer);
        console.log(guessArray)
        divGameBoard.style.display = 'none';
        showResultsScreen()
    }
}

function getRandomItemFromArray(array){
    return array[Math.floor(Math.random()*array.length)];
}

function newRound(){
    let MIN = 1
    let MAX = 9
    let num1 = parseInt(practiceNumValue) || getRandomIntInclusive(MIN,MAX)
    let num2 = getRandomIntInclusive(MIN, MAX)
    let operator = getRandomItemFromArray(operatorArray)
    solution = parseFloat(eval(num1 + operator + num2).toFixed(3))
    console.log(solution)
    guessDisplay.focus()

    currentQuestionDisplay.textContent = questionCurrent
    totalQuestionsCountDisplay.textContent = questionMax
    num1Display.textContent = num1
    num2Display.textContent = num2
    operatorDisplay.textContent = operator

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
            clearInterval(timer);
            console.log(guessArray)
            divGameBoard.style.display = 'none';
            showResultsScreen()
        } else{
        messageDisplay.classList.add('correct')
        let removeShake = setTimeout(clearCorrectClass, 1000)
        clearScreen()
        newRound()
        }
    }
    else {
        messageDisplay.textContent = 'Try again!'
        messageDisplay.classList.add('shake')
        let removeShake = setTimeout(clearShakeClass,1000)
        clearScreen()
        guessDisplay.focus()
    }
}

function clearShakeClass(){
    messageDisplay.classList.remove('shake')
}

function clearCorrectClass() {
    messageDisplay.classList.remove('correct')
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
    } while (ignoreNumArray.includes(tempValue));
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
