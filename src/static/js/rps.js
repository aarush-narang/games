(() => {
    // vars
    let clientChoice
    let computerChoice
    const clientMsg = document.getElementById('msg')
    const choices = document.getElementById('rps-choices').querySelectorAll('button')
    const playAgainBtn = document.getElementById('play-again')
    const resetScoreBtn = document.getElementById('reset-score')
    const diffSelect = document.getElementById('diff-select')

    // fns
    function displayMsg(msg = '', delay = 5000, type = 'error') {
        clientMsg.innerText = msg
        clientMsg.style.display = 'block'
        clientMsg.classList.add(type.toLowerCase())

        delay === 0 ? delay = 1000000 : delay

        setTimeout(resetMsg, delay);
    }

    function resetMsg() {
        clientMsg.style.display = 'none'
        clientMsg.innerText = ''
        clientMsg.classList.remove('win')
        clientMsg.classList.remove('error')
        clientMsg.classList.remove('warning')
    }

    function resetGame() {
        choices.forEach(btn => {
            btn.classList.remove('disabled')
            btn.classList.remove('pressed')
            btn.classList.add('btn-effect')
            btn.toggleAttribute('disabled', false)
        })
        resetMsg()
    }

    function getCompChoice(clientWin, clientChoice) {
        if (clientChoice.toLowerCase() == 'rock' && clientWin) return 'scissors'
        else if (clientChoice.toLowerCase() == 'paper' && clientWin) return 'rock'
        else if (clientChoice.toLowerCase() == 'scissors' && clientWin) return 'paper'

        else if (!clientWin) {
            const num = getRandomInt(1, 100)
            if (clientChoice.toLowerCase() == 'rock') {
                if (num < 80) return 'paper'
                else return 'rock'
            } else if (clientChoice.toLowerCase() == 'paper') {
                if (num < 80) return 'scissors'
                else return 'paper'
            } else if (clientChoice.toLowerCase() == 'scissors') {
                if (num < 80) return 'rock'
                else return 'scissors'
            }
        }
    }

    function winCheck(user, computer) {
        if (user === computer) {
            return 'tie'
        } else if (user == 'rock') {
            if (computer === 'paper') {
                return 'computer'
            } else {
                return 'user'
            }
        } else if (user === 'paper') {
            if (computer == 'scissors') {
                return 'computer'
            } else {
                return 'user'
            }
        } else if (user === 'scissors') {
            if (computer === 'rock') {
                return 'computer'
            } else {
                return 'user'
            }
        }
    }

    function updateScore() {
        const userScore = document.getElementById('score-user')
        const computerScore = document.getElementById('score-computer')
        if (!window.localStorage.getItem('rpsscore')) window.localStorage.setItem('rpsscore', '{"wins":0,"losses":0,"ties":0}')
        const storageScore = JSON.parse(window.localStorage.getItem('rpsscore'))

        userScore.innerText = storageScore.wins
        computerScore.innerText = storageScore.losses
    }
    updateScore()
    // other code
    playAgainBtn.addEventListener('click', resetGame)
    resetScoreBtn.addEventListener('click', () => {
        window.localStorage.setItem('rpsscore', '{"wins":0,"losses":0,"ties":0}')
        updateScore()
    })
    diffSelect.addEventListener('change', resetGame)

    choices.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const difficulty = diffSelect.value.toLowerCase()
            clientChoice = event.target.innerText.toLowerCase()
            const randomNumber = getRandomInt(1, 100)

            // lock in their choice
            btn.classList.add('pressed')
            choices.forEach(btn => {
                btn.classList.add('disabled')
                btn.classList.remove('btn-effect')
                btn.toggleAttribute('disabled', true)
            })

            // disable buttons so they cant restart game in the middle of another one
            playAgainBtn.classList.add('disabled')
            playAgainBtn.toggleAttribute('disabled', true)
            diffSelect.classList.add('disabled')
            diffSelect.toggleAttribute('disabled', true)
            resetScoreBtn.classList.add('disabled')
            resetScoreBtn.toggleAttribute('disabled', true)

            // get the computer's choice
            displayMsg('Choosing...', 1500, 'warning')

            setTimeout(() => {
                if (difficulty === 'easy') {
                    if (randomNumber < 70) computerChoice = getCompChoice(true, clientChoice)
                    else computerChoice = getCompChoice(false, clientChoice)
                } else if (difficulty === 'medium') {
                    if (randomNumber < 40) computerChoice = getCompChoice(true, clientChoice)
                    else computerChoice = getCompChoice(false, clientChoice)
                } else if (difficulty === 'hard') {
                    if (randomNumber < 10) computerChoice = getCompChoice(true, clientChoice)
                    else computerChoice = getCompChoice(false, clientChoice)
                } else if (difficulty === 'impossible') {
                    if (randomNumber < 5) computerChoice = getCompChoice(true, clientChoice)
                    else computerChoice = getCompChoice(false, clientChoice)
                } else if (difficulty === 'random') {
                    computerChoice = ['rock', 'paper', 'scissors'][getRandomInt(0, 2)]
                }

                const winner = winCheck(clientChoice, computerChoice)

                // get score from localstorage
                if(!window.localStorage.getItem('rpsscore')) window.localStorage.setItem('rpsscore', '{"wins":0,"losses":0,"ties":0}')
                const rpsscore = JSON.parse(window.localStorage.getItem('rpsscore'))

                if (winner === 'user') { // update score here in localstorage
                    displayMsg(`I chose ${computerChoice} and you chose ${clientChoice}, you won!`, 0, 'win')
                    rpsscore.wins += 1
                } else if (winner === 'computer') {
                    displayMsg(`I chose ${computerChoice} and you chose ${clientChoice}, you lost.`, 0, 'error')
                    rpsscore.losses += 1
                } else if (winner === 'tie') {
                    displayMsg(`I chose ${computerChoice} and you chose ${clientChoice}, we tied.`, 0, 'warning')
                    rpsscore.ties += 1
                }
                window.localStorage.setItem('rpsscore', JSON.stringify(rpsscore))
                updateScore()

                // enable buttons
                diffSelect.classList.remove('disabled')
                diffSelect.toggleAttribute('disabled', false)
                playAgainBtn.classList.remove('disabled')
                playAgainBtn.toggleAttribute('disabled', false)
                resetScoreBtn.classList.remove('disabled')
                resetScoreBtn.toggleAttribute('disabled', false)
            }, 1501);
        })
    })
})()