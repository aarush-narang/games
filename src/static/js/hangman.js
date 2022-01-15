let fullWord = ''
let fullWordArr = []
let currentWordArr = []
let lettersFound = 0
let revealed = false
let hints = 0
let wrongGuessed = []
let guessed = []
let tries = 0

// add image of hangman, implement # of tries, add styles to hint & tries display

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

let difficulty = diffSelect.value.toLowerCase()

function clearVariables() {
    fullWord = ''
    fullWordArr = []
    currentWordArr = []
    lettersFound = 0
    revealed = false
    hints = 0
    tries = 0
    wrongGuessed = []
    guessed = []
    resetMsg()
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
    else tries = wordLength <= 6 ? 4 : wordLength <= 9 ? 5 : wordLength <= 12 ? 6 : wordLength >= 13 ? 8 : 5

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
    })
    wordReq.addEventListener('error', (event) => {
        console.log(event)
    })
    wordReq.open('GET', `/hangman/randomWord?diff=${diff}`)
    wordReq.send()

    userInput.toggleAttribute('disabled', false) // enables the guess input field
    userSubmitBtn.toggleAttribute('disabled', false) // enables the guess input submit button
}

function loadWord() {
    wordDisplay.innerHTML = '' // reset the html
    fullWordArr.forEach(letter => {
        wordDisplay.innerHTML += `
            <div class="letter">
                <letter></letter>
                <span class="letter-underline"></span>
            </div>
        `
    });
}

function revealWord() {
    if (revealed) return
    revealed = true

    wordDisplay.innerHTML = '' // reset the html
    fullWordArr.forEach(letter => {
        wordDisplay.innerHTML += `
            <div class="letter">
                <letter>${letter}</letter>
                <div class="letter-underline"></div>
            </div>
        `
    });

    userInput.toggleAttribute('disabled', true) // disables the guess input field
    userSubmitBtn.toggleAttribute('disabled', true) // disables the guess input submit button
}

function displayMsg(msg='', delay=5000, type='error') {
    clientMsg.innerText = msg
    clientMsg.style.display = 'block'
    clientMsg.classList.add(type.toLowerCase())
    userInput.value = ''

    const errorMsgTimeout = setTimeout(resetMsg, delay);
    userInput.addEventListener('input', () => {
        clearTimeout(errorMsgTimeout)
        resetMsg()
    })
    clientMsg.addEventListener('click', (event) => {
        clearTimeout(errorMsgTimeout)
        resetMsg()
    })
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
    userInput.value = ''

    // some checks to run on the guess
    if (guess.length === 0) return displayMsg('Please guess a letter.', 5000, 'error')
    if (guess.match(/^[A-Z]+$/) === null) return displayMsg('Only letters are in words!', 5000, 'error')
    if (guess.length > 1 && guess.length !== fullWord.length) return displayMsg('Your guess is not a letter but it is also not as long as the word. Guess again!', 8000, 'error') // if the input value is not applicable
    if (guessed.includes(guess) || wrongGuessed.includes(guess)) return displayMsg(`You\'ve already guessed "${guess}"!`, 6000, 'error')
    if (guess.length > 1 && guess === fullWord) {
        revealWord()
        return displayMsg('You got the word!', 100000, 'win')
    }

    const letterIndexes = [] // all indexes where the guess was found
    currentWordArr.map((val, index, arr) => {
        if (val && val.toUpperCase() === guess) {
            letterIndexes.push(index)
            currentWordArr[index] = null
        }
    })

    if (letterIndexes.length === 0) {
        displayMsg('Incorrect guess.', 3000, 'error')

        tries--
        triesDisplay.innerText = `Tries: ${tries}`

        if(tries === 0) { // delay is not properly working
            revealWord()
            return displayMsg('You were not able to get the word!', 100000, 'error')
        }

        return wrongGuessed.push(guess)
    } // add the wrong guess to the arr
    else guessed.push(guess) // add the correct guess to the arr

    const letters = wordDisplay.querySelectorAll('.letter')

    letterIndexes.forEach(index => {
        letters[index].querySelector('letter').innerText = fullWordArr[index]
        lettersFound++
    })
    if (lettersFound === fullWord.length) {
        revealWord()
        return displayMsg('You got the word!', 100000, 'win')
    }
    return
})

revealWordBtn.addEventListener('click', (event) => revealWord())

newWordBtn.addEventListener('click', (event) => getNewWord(difficulty))

wordHintBtn.addEventListener('click', (event) => {
    if (revealed) return
    if (hints <= 0) return displayMsg('Max hints used.', 5000, 'error')
    if (hints >= fullWord.length - lettersFound) return displayMsg('The number of hints available is greater than or equal to the number of letters remaining.', 8000, 'error')

    let randomLetterIndex = getRandomInt(0, fullWordArr.length - 1) // random letter index
    const letters = wordDisplay.querySelectorAll('.letter') // all letter containers

    // prevents overlapping hints
    while (currentWordArr[randomLetterIndex] === null) randomLetterIndex = getRandomInt(0, fullWordArr.length - 1)

    const hintLetter = fullWordArr[randomLetterIndex]

    // letter chosen with the index from the container
    letters[randomLetterIndex].querySelector('letter').innerText = hintLetter
    currentWordArr[randomLetterIndex] = null // the letter was found, so change this to null

    const letterTest = currentWordArr.find(letter => letter === hintLetter) // if there are no more of the hint letter, push it to guessed
    if(!letterTest) guessed.push(hintLetter) // this will prevent accidental subtraction of tries on a revealed letter

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
    else if (difficulty === 'random') getNewWord(difficulty) // random # of letters and 5 tries
})