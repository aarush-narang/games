function getNewWord() {
    const wordReq = new XMLHttpRequest()

    wordReq.addEventListener('load', (event) => {
        loadWord(event.target.responseText)
    })
    wordReq.addEventListener('error', (event) => {
        console.log(event)
    })
    wordReq.open('GET', '/hangman/randomWord')
    wordReq.send()
}

function loadWord(word) {
    const word_arr = word.split('')
    console.log(word_arr)
    word_arr.forEach(letter => {
        return
    });
}

getNewWord()