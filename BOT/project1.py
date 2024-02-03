

print("Welcome to the game score evaluator!")

while True:
    userinput = input("Enter a game score (or 'q' to quit): ")

    if userinput.lower() == 'q':
        print("Thanks for using the game evaluator!")
        break
    
    try:
        evaulate_score = int(userinput)
        
        if 0 <= evaulate_score <= 100:
            determine_score = "Beginner"
        elif 101 <= evaulate_score <= 500:
            determine_score = "Intermediate"
        elif 501 <= evaulate_score <= 1000:
            determine_score = "Advanced"
        elif evaulate_score < 0:
            determine_score = "This is an invalid score"
        else:
            determine_score = "Expert"

        
        print("That preformance level is " + determine_score)
    except ValueError:
        print("Invalid input. Score cannot be negative.")
