from openai import OpenAI

client = OpenAI()

while True:
    prompt = input("You: ")
    if prompt.lower() in {"exit", "quit"}:
        break

    response = client.responses.create(
        model="gpt-5.4",
        input=prompt
    )

    print("\nAssistant:", response.output_text, "\n")