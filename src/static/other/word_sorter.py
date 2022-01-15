def main():
    with open('C:\\Users\\Aarus\\Documents\\code\\Coding Projects\\games\\src\\static\\other\\words\\allwords.txt', 'r') as f:
        words = list(f)
    
    easy = ''.join(list(filter(lambda word: len(word) <= 6, words)))
    medium = ''.join(list(filter(lambda word: len(word) >= 7 and len(word) <= 9, words)))
    hard = ''.join(list(filter(lambda word: len(word) >= 10 and len(word) <= 12, words)))
    imp = ''.join(list(filter(lambda word: len(word) >= 13, words)))

    with open('C:\\Users\\Aarus\\Documents\\code\\Coding Projects\\games\\src\\static\\other\\words\\easyWords.txt', 'w') as f:
        f.write(easy)
    with open('C:\\Users\\Aarus\\Documents\\code\\Coding Projects\\games\\src\\static\\other\\words\\mediumWords.txt', 'w') as f:
        f.write(medium)
    with open('C:\\Users\\Aarus\\Documents\\code\\Coding Projects\\games\\src\\static\\other\\words\\hardWords.txt', 'w') as f:
        f.write(hard)
    with open('C:\\Users\\Aarus\\Documents\\code\\Coding Projects\\games\\src\\static\\other\\words\\impossibleWords.txt', 'w') as f:
        f.write(imp)
    
    print(len(easy), len(medium), len(hard), len(imp))

if __name__ == '__main__':
    main()