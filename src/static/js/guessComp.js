(() => {
    // element vars
    const newNum = document.getElementById('new-num')
    const playBtn = document.getElementById('play-btn')
    const settingsForm = document.getElementById('settings')

    const clientConsole = document.getElementById('console')
    const consoleText = document.getElementById('console-text')
    const clientMsg = document.getElementById('msg')

    const minInput = document.getElementById('min-range')
    const maxInput = document.getElementById('max-range')
    const actualNum = document.getElementById('guess-input')

    // fns
    function displayMsg(msg = '', delay = 5000, type = 'error') {
        clientMsg.innerText = msg
        clientMsg.style.opacity = '100'
        clientMsg.style.pointerEvents = 'all'
        clientMsg.classList.add(type.toLowerCase())

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
        actualNum.addEventListener('input', (event) => {
            clearTimeout(errorMsgTimeout)
            resetMsg()
        })
        clientMsg.addEventListener('click', (event) => {
            clearTimeout(errorMsgTimeout)
            resetMsg()
        })
    }

    function resetMsg() {
        clientMsg.style.opacity = '0'
        clientMsg.style.pointerEvents = 'none'
        clientMsg.innerText = ''
        clientMsg.classList.remove('success')
        clientMsg.classList.remove('error')
        clientMsg.classList.remove('warning')
    }

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
        minInput.value = ''
        maxInput.value = ''
        actualNum.value = ''
        consoleText.innerText = ''

        clientConsole.classList.remove('console-f')
        playBtn.classList.remove('pressed')
        randomNumber = null
        minVal = null
        maxVal = null
        guessed = []
        tries = 0
        resetMsg()
        enable(minInput, maxInput, actualNum)
    }

    function solve(lower_limit, upper_limit, user_number) {
        let guess = 0 // current guess
        const guesses = [] // guesses made
        let tries = 0

        const solveInterval = setInterval(() => {
            tries += 1

            guess = Math.trunc(((upper_limit - lower_limit) / 2) + lower_limit)

            consoleText.innerText = guesses.join('\n')

            if (guess > user_number) {
                upper_limit = guess
                guesses.push(`Guess: ${guess}. Making new guess...`)
            } else if (guess < user_number) {
                lower_limit = guess
                guesses.push(`Guess: ${guess}. Making new guess...`)
            } else {
                guesses.push(`Guess: ${guess}. I got your number in ${tries} tries!`)
                consoleText.innerText = guesses.join('\n')
                clearInterval(solveInterval)
            }
        }, 200);
    }

    window.addEventListener('keypress', () => { // if they type text and the guess input isnt focused, focus it
        if (minInput.value === '') {
            minInput.focus()
        } else if (maxInput.value === '') {
            maxInput.focus()
        } else if (actualNum.value === '') {
            actualNum.focus()
        }
    })

    settingsForm.addEventListener('submit', (event) => { // when the range is entered and it passes the tests, enable the guessing area and disable the range area
        event.preventDefault()
        if (!minInput.value) return displayMsg('Please enter a minimum value.', 5000, 'error')
        else if (!maxInput.value) return displayMsg('Please enter a maximum value.', 5000, 'error')
        else if (!actualNum.value) return displayMsg('Please enter your number, it will only be used to check whether my numbers are greater or smaller than your number', 10000, 'error')

        minVal = Number(minInput.value)
        maxVal = Number(maxInput.value)
        if (actualNum.value > maxVal || actualNum.value < minVal) return displayMsg('Your actual number cannot be out of your set range', 8000, 'error')

        disable(minInput, maxInput, actualNum)

        if (minVal > maxVal) return displayMsg('The minimum value has to be greater than the maximum value.', 8000, 'warning')
        else if (minVal === maxVal) return displayMsg('Your minimum value cannot equal your maximum value.', 5000, 'error')
        playBtn.classList.add('pressed')

        solve(minVal, maxVal, actualNum.value)
        clientConsole.classList.add('console-f')

    })

    newNum.addEventListener('click', restart) // If they restart, clear all variables and disable guess area
})()