let currentPlayer = 1 // player 1 is cross, player 2 is circle
const game = document.getElementById('game')
const buttons = game.querySelectorAll('button')

function switchPlayer() {
    buttons.forEach(button => {
        if (currentPlayer === 1 && !button.classList.contains('crossTaken') && !button.classList.contains('circleTaken')) {
            button.classList.add('cross')
            button.classList.remove('circle')
        }
        else if (currentPlayer === 2 && !button.classList.contains('crossTaken') && !button.classList.contains('circleTaken')) {
            button.classList.add('circle')
            button.classList.remove('cross')
        }
    })
}

buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        // put an x or o in that spot and store in a 2d array which spot is taken by which player and then switch player
        const target = event.target
        const parent = target.parentElement
        if (parent.nodeName !== 'BUTTON') return // make sure the entire board does not get the class name instead of the spot they click
        if (currentPlayer === 1) parent.classList.add('crossTaken')
        if (currentPlayer === 2) parent.classList.add('circleTaken')
        parent.classList.remove('circle')
        parent.classList.remove('cross')
        currentPlayer = currentPlayer === 1 ? 2 : 1
        switchPlayer()
    })
})