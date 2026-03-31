import requests
from email.message import EmailMessage
import ssl
import smtplib
from datetime import datetime

def fetch_news(api_url, api_key, topics):
    headers = {"Authorization": api_key}
    query = " OR ".join(topics)

    params = {
        "q": query,
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": 6
    }

    response = requests.get(api_url, headers=headers, params=params)

    if response.status_code == 200:
        data = response.json()
        return data.get("articles", [])
    else:
        print("News API error:", response.status_code, response.text)
        return []

def shorten_text(text, max_len=180):
    if not text:
        return "No summary available."
    text = text.strip()
    if len(text) <= max_len:
        return text
    return text[:max_len].rsplit(" ", 1)[0] + "..."

def why_it_matters(article):
    title = (article.get("title") or "").lower()
    desc = (article.get("description") or "").lower()
    combined = title + " " + desc

    if any(word in combined for word in ["ai", "technology", "software", "chip", "cyber", "startup"]):
        return "This matters because it could shape technology trends, business strategy, and future innovation."
    elif any(word in combined for word in ["market", "economy", "stocks", "inflation", "finance", "bank"]):
        return "This matters because it may affect markets, consumer confidence, and financial decision-making."
    elif any(word in combined for word in ["election", "policy", "government", "senate", "president", "war"]):
        return "This matters because political decisions can quickly influence public policy, global stability, and everyday life."
    elif any(word in combined for word in ["health", "disease", "medical", "hospital", "drug"]):
        return "This matters because health developments can influence public safety, medical choices, and long-term wellbeing."
    elif any(word in combined for word in ["sport", "nba", "nfl", "soccer", "fifa", "mlb"]):
        return "This matters because it impacts major teams, fan conversations, and the wider sports landscape."
    else:
        return "This matters because it highlights a current development that could influence public conversation and future events."

def format_date(date_string):
    if not date_string:
        return "Recent"
    try:
        dt = datetime.strptime(date_string, "%Y-%m-%dT%H:%M:%SZ")
        return dt.strftime("%B %d, %Y")
    except:
        return "Recent"

def compile_plaintext_content(articles, topics):
    content = f"Your Daily News Digest\nTopics: {', '.join(topics)}\n\n"

    for i, article in enumerate(articles, start=1):
        title = article.get("title", "No title")
        summary = shorten_text(article.get("description", "No summary available"), 160)
        url = article.get("url", "#")
        date = format_date(article.get("publishedAt"))
        impact = why_it_matters(article)

        content += (
            f"{i}. {title}\n"
            f"Published: {date}\n"
            f"Summary: {summary}\n"
            f"Why it matters: {impact}\n"
            f"Read more: {url}\n\n"
        )

    return content

def compile_html_content(articles, topics):
    topic_text = ", ".join(topics)

    article_blocks = ""
    for article in articles:
        title = article.get("title", "No title")
        summary = shorten_text(article.get("description", "No summary available"), 220)
        url = article.get("url", "#")
        source = article.get("source", {}).get("name", "Unknown Source")
        date = format_date(article.get("publishedAt"))
        impact = why_it_matters(article)
        image = article.get("urlToImage")

        image_html = ""
        if image:
            image_html = f"""
            <img src="{image}" alt="Article image"
                 style="width:100%; max-height:220px; object-fit:cover; border-radius:12px; margin-bottom:14px;">
            """

        article_blocks += f"""
        <div style="background:#ffffff; border:1px solid #e5e7eb; border-radius:16px; padding:22px; margin-bottom:22px; box-shadow:0 4px 14px rgba(0,0,0,0.05);">
            {image_html}
            <div style="font-size:13px; color:#6b7280; margin-bottom:8px;">{source} • {date}</div>
            <h2 style="margin:0 0 12px 0; font-size:22px; line-height:1.35; color:#111827;">{title}</h2>
            <p style="margin:0 0 14px 0; font-size:15px; line-height:1.7; color:#374151;">
                {summary}
            </p>
            <div style="background:#f9fafb; border-left:4px solid #2563eb; padding:12px 14px; border-radius:10px; margin-bottom:16px;">
                <div style="font-weight:700; color:#111827; margin-bottom:6px;">Why it matters</div>
                <div style="font-size:14px; line-height:1.6; color:#374151;">{impact}</div>
            </div>
            <a href="{url}" style="display:inline-block; background:#2563eb; color:#ffffff; text-decoration:none; padding:10px 16px; border-radius:10px; font-weight:600;">
                Read Full Story
            </a>
        </div>
        """

    html = f"""
    <html>
    <body style="margin:0; padding:0; background:#f3f4f6; font-family:Arial, Helvetica, sans-serif;">
        <div style="max-width:760px; margin:0 auto; padding:30px 20px;">
            <div style="background:linear-gradient(135deg, #1d4ed8, #2563eb); color:white; border-radius:18px; padding:30px; margin-bottom:24px;">
                <h1 style="margin:0; font-size:30px;">Your Daily News Digest</h1>
                <p style="margin:12px 0 0 0; font-size:16px; line-height:1.6; color:#dbeafe;">
                    A curated roundup based on your selected topics: <strong>{topic_text}</strong>
                </p>
            </div>

            <div style="margin-bottom:18px; color:#4b5563; font-size:15px; line-height:1.7;">
                Here are the most relevant and recent stories pulled together for you in a cleaner, easier-to-read format.
            </div>

            {article_blocks}

            <div style="text-align:center; color:#6b7280; font-size:13px; padding:20px 10px;">
                Sent automatically by your personal news digest bot
            </div>
        </div>
    </body>
    </html>
    """

    return html

def send_news_email(receiver_email, user_topics):
    if not receiver_email or "@" not in receiver_email:
        print("Invalid recipient email.")
        return

    if not user_topics:
        print("Please choose at least one topic.")
        return

    api_url = "https://newsapi.org/v2/everything"
    api_key = "899b637044f445f69c8bd67d98c7818a"

    articles = fetch_news(api_url, api_key, user_topics)
    if not articles:
        print("Failed to fetch news.")
        return

    sender = "salehtoufic15@gmail.com"
    password = 'rkoi keku rneg yqkl'
    subject = "Your Curated News Digest"

    plain_text = compile_plaintext_content(articles, user_topics)
    html_content = compile_html_content(articles, user_topics)

    message = EmailMessage()
    message["From"] = sender
    message["To"] = receiver_email.strip()
    message["Subject"] = subject
    message.set_content(plain_text)
    message.add_alternative(html_content, subtype="html")

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as smtp:
        smtp.login(sender, password)
        smtp.send_message(message)

    print("News email has been sent!")

receiver_email = input("Enter your email: ").strip()

print(
    "Technology\n"
    "Business and Finance\n"
    "Politics\n"
    "Health\n"
    "Entertainment\n"
    "Sports\n"
    "Science\n"
    "Lifestyle\n"
    "World News\n"
    "Education\n"
)

user_topics = []
while True:
    topic = input("Select a topic or type 'done' to finish: ").strip()
    if topic.lower() == "done":
        break
    if topic:
        user_topics.append(topic)

send_news_email(receiver_email, user_topics)