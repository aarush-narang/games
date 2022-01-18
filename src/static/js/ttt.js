(() => {
    let currentPlayer = 1 // player 1 is cross, player 2 is circle
    let gameFinished = false
    const game = document.getElementById('game')
    const buttons = game.querySelectorAll('button')
    const playerText = document.querySelector('player')
    const scoreBoard = document.getElementById('score')
    let x = 0
    let o = 0

    // reload score
    function reloadScore() {
        const storage = window.localStorage.getItem('tttscore') || ''
        if (storage !== '') {
            const score = JSON.parse(storage)
            x = score.x || 0
            o = score.o || 0
            scoreBoard.innerText = `(X) ${x} - ${o} (O)`
        } else {
            scoreBoard.innerText = `(X) 0 - 0 (O)`
        }
    }

    // switch player and player text
    function switchPlayer() {
        buttons.forEach(button => {
            if (currentPlayer === 1 && !button.classList.contains('crossTaken') && !button.classList.contains('circleTaken')) {
                button.classList.add('cross')
                button.classList.remove('circle')
            } else if (currentPlayer === 2 && !button.classList.contains('crossTaken') && !button.classList.contains('circleTaken')) {
                button.classList.add('circle')
                button.classList.remove('cross')
            }
        })
        playerText.innerText = `Player ${currentPlayer === 1 ? '\"X\"' : '\"O\"'}`
    }

    // tic tac toe logic
    function updateScore(gameWinner) {
        if (gameWinner === "X") {
            x++
            scoreBoard.innerText = `(X) ${x} - ${o} (O)`
        } else if (gameWinner === 'O') {
            o++
            scoreBoard.innerText = `(X) ${x} - ${o} (O)`
        }
        window.localStorage.setItem('tttscore', JSON.stringify({
            x,
            o
        }))
    }

    function checkBoard() {
        const boardArray = []
        buttons.forEach(button => {
            if (button.classList.contains('crossTaken')) boardArray.push(1)
            else if (button.classList.contains('circleTaken')) boardArray.push(2)
            else boardArray.push(0)
        })
        // probably a better way of doing this but it checks who the winner is and updates the scoreboard
        // all left (0, 3, 6)
        if (boardArray[0] === boardArray[3] && boardArray[0] === boardArray[6] && boardArray[3] === boardArray[6] && boardArray[0] !== 0) {
            gameFinished = true
            const gameWinner = boardArray[0] === 1 ? 'X' : 'O'
            updateScore(gameWinner)

            playerText.innerText = `Player \"${gameWinner}\" wins!`
        }
        // all middle (1, 4, 7)
        else if (boardArray[1] === boardArray[4] && boardArray[1] === boardArray[7] && boardArray[4] === boardArray[7] && boardArray[1] !== 0) {
            gameFinished = true
            const gameWinner = boardArray[1] === 1 ? 'X' : 'O'
            updateScore(gameWinner)

            playerText.innerText = `Player \"${gameWinner}\" wins!`
        }
        // all right (2, 5, 8)
        else if (boardArray[2] === boardArray[5] && boardArray[2] === boardArray[8] && boardArray[5] === boardArray[8] && boardArray[2] !== 0) {
            gameFinished = true
            const gameWinner = boardArray[2] === 1 ? 'X' : 'O'
            updateScore(gameWinner)

            playerText.innerText = `Player \"${gameWinner}\" wins!`
        }
        // all top (0, 1, 2)
        else if (boardArray[0] === boardArray[1] && boardArray[0] === boardArray[2] && boardArray[1] === boardArray[2] && boardArray[0] !== 0) {
            gameFinished = true
            const gameWinner = boardArray[0] === 1 ? 'X' : 'O'
            updateScore(gameWinner)

            playerText.innerText = `Player \"${gameWinner}\" wins!`
        }
        // all middle (3, 4, 5)
        else if (boardArray[3] === boardArray[4] && boardArray[3] === boardArray[5] && boardArray[4] === boardArray[5] && boardArray[3] !== 0) {
            gameFinished = true
            const gameWinner = boardArray[3] === 1 ? 'X' : 'O'
            updateScore(gameWinner)

            playerText.innerText = `Player \"${gameWinner}\" wins!`
        }
        // all bottom (6, 7, 8)
        else if (boardArray[6] === boardArray[7] && boardArray[6] === boardArray[8] && boardArray[7] === boardArray[8] && boardArray[6] !== 0) {
            gameFinished = true
            const gameWinner = boardArray[6] === 1 ? 'X' : 'O'
            updateScore(gameWinner)

            playerText.innerText = `Player \"${gameWinner}\" wins!`
        }
        // bottom left to top right (6, 4, 2)
        else if (boardArray[6] === boardArray[4] && boardArray[6] === boardArray[2] && boardArray[4] === boardArray[2] && boardArray[2] !== 0) {
            gameFinished = true
            const gameWinner = boardArray[2] === 1 ? 'X' : 'O'
            updateScore(gameWinner)

            playerText.innerText = `Player \"${gameWinner}\" wins!`
        }
        // top left to bottom right (0, 4, 8)
        else if (boardArray[0] === boardArray[4] && boardArray[0] === boardArray[8] && boardArray[4] === boardArray[8] && boardArray[0] !== 0) {
            gameFinished = true
            const gameWinner = boardArray[0] === 1 ? 'X' : 'O'
            updateScore(gameWinner)

            playerText.innerText = `Player \"${gameWinner}\" wins!`
        } else if (!boardArray.includes(0)) {
            gameFinished = true
            playerText.innerText = 'The game is a tie!'
        }
    }

    reloadScore()

    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            // put an x or o in that spot and store in a 2d array which spot is taken by which player and then switch player
            const parent = event.target.parentElement
            // make sure the entire board does not get the class name instead of the spot they click and a spot cannot get clicked twice
            if (parent.nodeName !== 'BUTTON' || parent.classList.contains('crossTaken') || parent.classList.contains('circleTaken')) return

            if (currentPlayer === 1) parent.classList.add('crossTaken')
            if (currentPlayer === 2) parent.classList.add('circleTaken')
            parent.classList.remove('circle')
            parent.classList.remove('cross')

            currentPlayer = currentPlayer === 1 ? 2 : 1
            switchPlayer()

            checkBoard()
            if (gameFinished) {
                buttons.forEach(button => {
                    if (button.classList.contains('cross') || button.classList.contains('circle')) {
                        button.classList.remove('cross')
                        button.classList.remove('circle')
                        button.classList.add('gameFinished')
                    }
                })
                return
            }
        })
    })
    // keyboard inputs (1-9)
    document.addEventListener('keypress', (event) => {
        const key = Number(event.key)
        if (Number.isNaN(key)) return;
        if (key === 0) return;
        if (buttons[key - 1].classList.contains('crossTaken') || buttons[key - 1].classList.contains('circleTaken') || buttons[key - 1].classList.contains('gameFinished')) return

        if (currentPlayer === 1) buttons[key - 1].classList.add('crossTaken')
        if (currentPlayer === 2) buttons[key - 1].classList.add('circleTaken')
        buttons[key - 1].classList.remove('circle')
        buttons[key - 1].classList.remove('cross')

        currentPlayer = currentPlayer === 1 ? 2 : 1
        switchPlayer()

        checkBoard()
        if (gameFinished) {
            buttons.forEach(button => {
                if (button.classList.contains('cross') || button.classList.contains('circle')) {
                    button.classList.remove('cross')
                    button.classList.remove('circle')
                    button.classList.add('gameFinished')
                }
            })
            return
        }
    })

    // tic tac toe restart button
    const restartBtn = document.getElementById('restart-btn')
    restartBtn.addEventListener('click', (event) => {
        buttons.forEach(button => {
            button.classList.remove('crossTaken')
            button.classList.remove('circleTaken')
            button.classList.remove('gameFinished')
            button.classList.add('cross')
            currentPlayer = 1
            gameFinished = false
            switchPlayer()
        })
    })

    // reset score button
    const resetScoreBtn = document.getElementById('reset-score-btn')
    resetScoreBtn.addEventListener('click', (event) => {
        window.localStorage.setItem('tttscore', '')
        x = 0
        y = 0
        reloadScore()
    })
})()