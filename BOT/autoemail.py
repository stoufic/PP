import requests
from email.message import EmailMessage
import ssl
import smtplib

def fetch_news(api_url, api_key, topics):
    headers = {'Authorization': api_key}
    params = {'q': topics, 'language': 'en'}
    response = requests.get(api_url, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()['articles']
    else:
        return None

def compile_news_content(articles):
    content = "Here's your daily news roundup:\n\n"
    for article in articles:
        content += f"Title: {article['title']}\n"
        content += f"Summary: {article['description']}\n"
        content += f"Read more: {article['url']}\n\n"
    return content

def send_news_email(receiver_email):
    api_url = 'https://newsapi.org/v2/everything'
    api_key = '899b637044f445f69c8bd67d98c7818a' 
    

    articles = fetch_news(api_url, api_key, user_topics)
    if not articles:
        print("Failed to fetch news.")
        return

    email_body = compile_news_content(articles)

    sender = 'salehtoufic15@gmail.com'
    password = 'rkoi keku rneg yqkl'
    subject = "Here's What You've Missed"

    message = EmailMessage()
    message["From"] = sender
    message["To"] = receiver_email
    message["Subject"] = subject
    message.set_content(email_body)

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(host='smtp.gmail.com', port=465, context=context) as smtp:
        smtp.login(sender, password)
        smtp.send_message(message)

    print("News email has been sent!")

receiver_email = input("Enter your email: ")
print("Technology\n""Buisness and Finance\n""Politics\n""Health\n""Entertainment\n""Sports\n""Science\n""Lifestyle\n""World News\n""Education\n")
user_topics = []
while True:
    topic = input("Select a topic or type 'done' to finish: ")
    if topic.lower() == 'done':
        break
    user_topics.append(topic)
send_news_email(receiver_email)