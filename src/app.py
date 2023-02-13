from flask import Flask, render_template, request
import random

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/tictactoe')
def ttt():
    return render_template('ttt.html')

@app.route('/rps')
def rps():
    return render_template('rps.html')

@app.route('/hangman')
def hangman():
    return render_template('hangman.html')

@app.get('/hangman/randomWord')
def getHangmanWord():
    difficulty = request.args.get('diff')

    if difficulty == 'easy':
        with open('./static/other/words/easyWords.txt') as f:
            words = list(f)
    elif difficulty == 'medium':
        with open('./static/other/words/mediumWords.txt') as f:
            words = list(f)
    elif difficulty == 'hard':
        with open('./static/other/words/hardWords.txt') as f:
            words = list(f)
    elif difficulty == 'impossible':
        with open('./static/other/words/impossibleWords.txt') as f:
            words = list(f)
    else:
        with open('./static/other/words/allwords.txt') as f:
            words = list(f)
    

    word = random.choice(words).strip()
    return word

@app.route('/guess-user')
def guessUser():
    return render_template('guessUser.html')

@app.route('/guess-comp')
def guessComp():
    return render_template('guessComp.html')

if __name__ == '__main__':
    app.run(debug=True)