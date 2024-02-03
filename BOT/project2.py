'''
Project 2 - Scrabble Words - Fall 2023  
Author: Ayah Abu Hwail -- ayah22

This program simulates a simplified version of the Scrabble game.

I have neither given or received unauthorized assistance on this assignment.
Signed: Ayah Abu Hwail
'''

def make_points_dictionary():
    '''
 Create and return a dictionary of letters mapped to their respective Scrabble point values
    '''
    letters = {
        'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1, 'F': 4, 'G': 2,
        'H': 4, 'I': 1, 'J': 8, 'K': 5, 'L': 1, 'M': 3, 'N': 1,
        'O': 1, 'P': 3, 'Q': 10, 'R': 1, 'S': 1, 'T': 1, 'U': 1,
        'V': 4, 'W': 4, 'X': 8, 'Y': 4, 'Z': 10, '-': 0
    }
    return letters

def get_word_value(p_dict, line):
    ''' 
    Calculate the Scrabble point value of a word using the given 
    points dictionary. The word's value is increased by its 
    respective bonus.
    '''
    str_input = line.split()
    word = str_input[0].upper()
    score = 0
    if len(str_input) > 1:
        bonus = str_input[1]
        index = 0
        if len(str_input) == 3:
            index = int(str_input[2]) - 1
    
        for i, letter in enumerate(word):
            if i == index and bonus == "DL":
                score += 2 * p_dict[letter]
            elif i == index and bonus == "TL":
                score += 3 * p_dict[letter]
            else:
                score += p_dict[letter]

        if bonus == "DW":
            score *= 2
        elif bonus == "TW":
            score *= 3
    else:
        for letter in word:
            score += p_dict[letter]

    return score

def print_results(fs_p1, fs_p2):
    ''' 
    Print the final results including each player's total score and 
    the winner.
    '''
    print("\nPlayer 1 score:", fs_p1)
    print("Player 2 score:", fs_p2)

    if fs_p1 > fs_p2:
        print("\nPlayer 1 wins!")
    elif fs_p1 < fs_p2:
        print("\nPlayer 2 wins!")
    else:
        print("\nIt's a tie!")

def main():
    ''' 
    The main driver function. It initializes the points dictionary, 
    reads words from a text file, calculates scores for each word 
    and finally prints the results.
    '''
    points_dict = make_points_dictionary()
    total_score_p1 = 0
    total_score_p2 = 0

    with open('scrabble_words.txt', 'r') as text_file:
        lines = text_file.readlines()
        for i, line in enumerate(lines):
            score = get_word_value(points_dict, line.strip())
            if i % 2 == 0:
                total_score_p1 += score
            else:
                total_score_p2 += score
            print(line.strip(), score)

    print_results(total_score_p1, total_score_p2)

# Call main like this to keep Web-CAT happy:
if __name__ == '__main__':
     main()