import openai

openai.api_key = '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'

def chat_with_bot(prompt):
    messages = [{'role': 'system', 'content': 'You are a helpful assistant.'},
                {'role': 'user', 'content': prompt}]

    response = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',
        messages=messages,
        n=1,
        max_tokens=100,
        stop=None,
        temperature=0.7
    )

    bot_reply = response.choices[0].message.content
    return bot_reply

# Example usage
user_input = input("Ask a question or say something: ")
while user_input.lower() != 'bye':
    bot_response = chat_with_bot(user_input)
    print("Bot:", bot_response)
    user_input = input("You: ")
