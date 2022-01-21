(() => {
    // vars
    let randomNumber
    let tries = 0
    let maxVal, minVal
    let guessed = []

    // element vars
    const revealNumber = document.getElementById('reveal-num')
    const newNum = document.getElementById('new-num')
    const playBtn = document.getElementById('play-btn')
    const guessBtn = document.getElementById('guess-num')
    const guessForm = document.getElementById('guess-form')

    const clientMsg = document.getElementById('msg')

    const minInput = document.getElementById('min-range')
    const maxInput = document.getElementById('max-range')
    const guessInput = document.getElementById('guess-input')

    // fns
    function displayMsg(msg = '', delay = 5000, type = 'error') {
        clientMsg.innerText = msg
        clientMsg.style.display = 'block'
        clientMsg.classList.add(type.toLowerCase())

        guessInput.value = ''

        delay === 0 ? delay = 1000000 : delay

        const errorMsgTimeout = setTimeout(resetMsg, delay);
        minInput.addEventListener('input', (event) => {
            clearTimeout(errorMsgTimeout)
            resetMsg()
        })
        maxInput.addEventListener('input', (event) => {
            clearTimeout(errorMsgTimeout)
            resetMsg()
        })
        guessInput.addEventListener('input', (event) => {
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
        clientMsg.classList.remove('warning')
    }

    // for enabling and disabling elements
    function disable(...elements) {
        elements.forEach(element => {
            element.toggleAttribute('disabled', true)
            element.classList.add('disabled')
        })
    }
    function enable(...elements) {
        elements.forEach(element => {
            element.toggleAttribute('disabled', false)
            element.classList.remove('disabled')
        })
    }

    function restart() { // If restarted, enable only range area
        enable(minInput, maxInput, playBtn)

        minInput.value = ''
        maxInput.value = ''
        guessInput.value = ''

        playBtn.classList.remove('pressed')
        randomNumber = null
        minVal = null
        maxVal = null
        guessed = []
        tries = 0
        disable(guessBtn, guessInput)
    }

    disable(guessBtn, guessInput, revealNumber) // disable the guessing area before they enter a range

    playBtn.addEventListener('click', (event) => { // when the range is entered and it passes the tests, enable the guessing area and disable the range area
        minVal = Number(minInput.value)
        maxVal = Number(maxInput.value)
        if (!minVal) return displayMsg('Please enter a minimum value.', 5000, 'error')
        else if (!maxVal) return displayMsg('Please enter a maximum value.', 5000, 'error')
        else if (minVal > maxVal) return displayMsg('The minimum value has to be greater than the maximum value.', 8000, 'warning')
        else if(minVal === maxVal) return displayMsg('Your minimum value cannot equal your maximum value.', 5000, 'error')

        enable(guessBtn, guessInput, revealNumber)
        disable(minInput, maxInput, playBtn)

        playBtn.classList.add('pressed')

        randomNumber = getRandomInt(minVal, maxVal)
        console.log(randomNumber) // for testing
    })
    guessForm.addEventListener('submit', (event) => { // when a guess is submitted run checks
        event.preventDefault()
        const guess = Number(guessInput.value)
        if(!guess) return displayMsg('Please enter a guess.', 5000, 'error')
        else if(guess > maxVal || guess < minVal) return displayMsg('Your guess is out of your set range.', 5000, 'warning')
        else if(guessed.includes(guess)) return displayMsg('You\'ve already guessed this number.', 5000, 'warning')
        else if(guess !== randomNumber) { // If they dont get the number, increase tries and add to array.
            guessed.push(guess)
            tries++
            displayMsg('Wrong number, Try again!', 5000, 'error')
        }
        else if(guess === randomNumber) { // If they do get the number and increase tries and disable the guessing area
            tries++
            displayMsg(`You got the number in ${tries} tries!`, 0, 'win')
            disable(guessBtn, guessInput, revealNumber)
        }
    })

    newNum.addEventListener('click', restart) // If they restart, clear all variables and disable guess area

    revealNumber.addEventListener('click', (event) => { // When they click the reveal number button, disable guess area in case it isnt already and display the number
        displayMsg(`Your number was ${randomNumber}.`, 0, 'error')
        disable(guessBtn, guessInput, revealNumber)
    })
})()