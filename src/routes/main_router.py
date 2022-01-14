import random
from flask import request

__name__ = 'main' # have to change the name for some reason otherwise it wont import

from flask import Blueprint, render_template

main_router = Blueprint(__name__, 'routes')

@main_router.route('/')
def home():
    return render_template('home.html')

@main_router.route('/tictactoe')
def ttt():
    return render_template('ttt.html')

@main_router.route('/rps')
def rps():
    return render_template('rps.html')

@main_router.route('/hangman')
def hangman():
    return render_template('hangman.html')

@main_router.get('/hangman/randomWord')
def getHangmanWord():
    print(request.args.get('diff'))
    with open('./static/other/allwords.txt') as f:
        words = list(f)

    word = random.choice(words).strip()
    return word

@main_router.route('/guess-user')
def guessUser():
    return render_template('guessUser.html')

@main_router.route('/guess-comp')
def guessComp():
    return render_template('guessComp.html')