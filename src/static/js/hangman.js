let fullWord = ''
let fullWordArr = []
let currentWordArr = []
let lettersFound = 0
let revealed = false
let hints = 0
let wrongGuessed = []
let guessed = []

let tries = 6
let difficulty = 'medium'


const wordDisplay = document.getElementById('wordDisplay')
const userForm = document.getElementById('user-guess-form')
const userInput = document.getElementById('user-input')
const userSubmitBtn = document.getElementById('user-input-submit')
const revealWordBtn = document.getElementById('reveal-word')
const newWordBtn = document.getElementById('new-word')
const wordHintBtn = document.getElementById('word-hint')
const clientMsg = document.getElementById('msg')
const hintsDisplay = document.getElementById('hints')
const triesDisplay = document.getElementById('tries')
const diffSelect = document.getElementById('diff-select')

// check difficulty here and update the number of tries

function clearVariables() {
    fullWord = ''
    fullWordArr = []
    currentWordArr = []
    lettersFound = 0
    revealed = false
    hints = 0
    hintsUsed = 0
    tries = 6 //
    maxTries = 0
    wrongGuessed = []
    guessed = []
}

function loadVariables(word, diff) {
    const wordLength = word.length
    fullWord = word
    fullWordArr = word.split('')
    currentWordArr = [...fullWordArr]
    hints = wordLength < 6 ? 1 : wordLength < 10 ? 2 : wordLength < 14 ? 3 : wordLength < 16 ? 4 : 5 // calculates the max number of hints allowed

    if (diff === 'easy') tries = 4
    else if (diff === 'medium') tries = 5
    else if (diff === 'hard') tries = 6
    else if (diff === 'impossible') tries = 8
    else tries = 5
    difficulty = diff

    return { hints, tries }
}

function getNewWord(diff='medium') {
    clearVariables() // make sure no previous word/variables are stored
    const wordReq = new XMLHttpRequest()
    wordReq.addEventListener('load', (event) => {
        const vals = loadVariables(event.target.responseText, difficulty)

        hintsDisplay.innerText = `Hints: ${vals.hints}`
        triesDisplay.innerText = `Tries: ${vals.tries}`

        loadWord(fullWord)

        console.log(fullWord)
        console.log(difficulty)
        console.log(hints)
    })
    wordReq.addEventListener('error', (event) => {
        console.log(event)
    })
    wordReq.open('GET', `/hangman/randomWord?diff=${diff}`)
    wordReq.send()
    userInput.toggleAttribute('disabled', false) // enables the guess input field
    userSubmitBtn.toggleAttribute('disabled', false) // enables the guess input submit button
}

function loadWord(word) {
    let innerhtml = ''
    fullWordArr.forEach(letter => {
        innerhtml += `
            <div class="letter">
                <letter></letter>
                <span class="letter-underline"></span>
            </div>
        `
    });
    wordDisplay.innerHTML = innerhtml
}

function revealWord() {
    if (revealed) return
    revealed = true
    const wordDisplay = document.getElementById('wordDisplay')
    let innerhtml = ''
    fullWordArr.forEach(letter => {
        innerhtml += `
            <div class="letter">
                <letter>${letter}</letter>
                <div class="letter-underline"></div>
            </div>
        `
    });
    wordDisplay.innerHTML = innerhtml
    userInput.toggleAttribute('disabled', true) // disables the guess input field
    userSubmitBtn.toggleAttribute('disabled', true) // disables the guess input submit button
}

function displayError(msg = 'Error', delay = 5000) {
    clientMsg.innerText = msg
    clientMsg.style.display = 'block'
    clientMsg.classList.add('error')
    const errorMsgTimeout = setTimeout(() => resetMsg(), delay);
    userInput.addEventListener('input', () => {
        clearTimeout(errorMsgTimeout)
        resetMsg()
    })
    userInput.value = ''
}

function displayWin() {
    clientMsg.innerText = 'You won!'
    clientMsg.style.display = 'block'
    clientMsg.classList.add('win')
    userInput.addEventListener('input', () => resetMsg())
    newWordBtn.addEventListener('click', (event) => resetMsg())
    userInput.value = ''
}

function resetMsg() {
    clientMsg.style.display = 'none'
    clientMsg.innerText = ''
    clientMsg.classList.remove('win')
    clientMsg.classList.remove('error')
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

getNewWord(difficulty)

userForm.addEventListener('submit', (event) => {
    event.preventDefault() // prevents page from refreshing when guess is submitted
    const guess = userInput.value.toUpperCase()

    // some checks to run on the guess
    if (guess.length === 0) return displayError('Please guess a letter.', 5000)
    if (guess.match(/^[A-Z]+$/) === null) return displayError('Only letters are in words!', 5000)
    if (guess.length > 1 && guess.length !== fullWord.length) return displayError('Your guess is not a letter but it is also not as long as the word. Guess again!', 8000) // if the input value is not applicable
    if (guessed.includes(guess) || wrongGuessed.includes(guess)) return displayError(`You\'ve already guessed "${guess}"!`, 6000)
    if (guess.length > 1 && guess === fullWord) {
        userInput.value = ''
        revealWord()
        return displayWin()
    }

    const letterIndexes = [] // all indexes where the guess was found
    fullWordArr.map((val, index, arr) => {
        if (val.toUpperCase() === guess) {
            letterIndexes.push(index)
            currentWordArr[index] = null
        }
    })
    console.log(tries)
    if (letterIndexes.length === 0) {
        displayError('Incorrect guess.', 3000)
        // tries--
        // triesDisplay.innerText = `Tries: ${tries}`
        return wrongGuessed.push(guess)
    } // add the wrong guess to the arr
    else guessed.push(guess) // add the correct guess to the arr

    const letters = wordDisplay.querySelectorAll('.letter')

    letterIndexes.forEach(index => {
        letters[index].querySelector('letter').innerText = fullWordArr[index]
        lettersFound++
    })
    userInput.value = ''
    if (lettersFound === fullWord.length) {
        revealWord()
        return displayWin()
    }
    return
})

revealWordBtn.addEventListener('click', (event) => revealWord())

newWordBtn.addEventListener('click', (event) => getNewWord())

wordHintBtn.addEventListener('click', (event) => {
    if (revealed) return
    if (hints <= 0) return displayError('Max hints used.', 5000)
    if (hints >= fullWord.length - lettersFound) return displayError('The number of hints available is greater than or equl to the number of letters remaining.', 8000)

    let randomLetterIndex = getRandomInt(0, fullWordArr.length - 1) // random letter index
    const letters = wordDisplay.querySelectorAll('.letter') // all letter containers

    // prevents overlapping hints
    while (currentWordArr[randomLetterIndex] === null) randomLetterIndex = getRandomInt(0, fullWordArr.length - 1)

    // letter chosen with the index from the container
    letters[randomLetterIndex].querySelector('letter').innerText = fullWordArr[randomLetterIndex]
    currentWordArr[randomLetterIndex] = null // the letter was found, so change this to null

    hints--
    lettersFound++
    hintsDisplay.innerText = `Hints: ${hints}`
})

diffSelect.addEventListener('change', (event) => { // load new word based on difficulty
    difficulty = event.target.value.toLowerCase()

    if (difficulty === 'easy') getNewWord(difficulty) // 6 letters or less and 4 tries
    else if (difficulty === 'medium') getNewWord(difficulty) // 7 to 9 (incl.) letters and 5 tries
    else if (difficulty === 'hard') getNewWord(difficulty) // 10 to 12 (incl.) letters and 6 tries
    else if (difficulty === 'impossible') getNewWord(difficulty) // 13 and above letters and 8 tries
})