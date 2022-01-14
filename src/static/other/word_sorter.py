def main():
    with open('C:\\Users\\aarus\\PycharmProjects\\games\\src\\static\\other\\allwords.txt', 'r') as f:
        words = list(f)
    
    easy = ''.join(list(filter(lambda word: len(word) <= 6, words)))
    medium = list(filter(lambda word: len(word) >= 7 and len(word) <= 9, words))
    hard = list(filter(lambda word: len(word) >= 10 and len(word) <= 12, words))
    imp = list(filter(lambda word: len(word) >= 13, words))

    with open('.\\easyWords.txt', 'w') as f:
        f.write(easy)
    
    print(len(easy), len(medium), len(hard), len(imp))

if __name__ == '__main__':
    main()