import random
from flask import jsonify, request
import json
import math

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

@main_router.route('/guess-user')
def guessUser():
    return render_template('guessUser.html')

@main_router.route('/guess-comp')
def guessComp():
    return render_template('guessComp.html')

@main_router.post('/guess-comp/solve')
def solve():
    data = request.data.decode()
    if data: data = json.loads(data)

    filter_data = list(filter(lambda entry: type(data[entry]) == int, data))
    if len(data) != 3 or len(filter_data) != 3: return jsonify(msg='DATA_ERROR')

    user_number_lower_lim = data['lower']
    user_number_upper_lim = data['upper']
    user_number = data['actual']

    if user_number_lower_lim > user_number_upper_lim: # check if their data is valid
        return jsonify(msg='LIMIT_ERROR')
    elif user_number > user_number_upper_lim or user_number < user_number_lower_lim:
        return jsonify(msg='NUMBER_OUT_OF_RANGE')

    guess = 0 # current guess
    guesses = [] # guesses made
    tries = 0
    upper_limit = user_number_upper_lim
    lower_limit = user_number_lower_lim

    while True:
        tries += 1
        if tries == 1:
            guess = math.floor((upper_limit+lower_limit) / 2)
            guesses.append(guess)

        if guess > user_number:
            upper_limit = guess
        elif guess < user_number:
            lower_limit = guess
        else:
            return jsonify(solve={ 'tries': tries, 'guesses': guesses })

        guess = math.trunc(((upper_limit - lower_limit) / 2) + lower_limit)
        guesses.append(guess) 
