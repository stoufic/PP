from email.message import EmailMessage
import ssl
import smtplib
import requests

x = input("ENTER YOUR EMAIL...")
#y = input("Now your app pass...")
y = 'fqdu jqfe lyta lytg'

sender = 'touficsaleh.2003@gmail.com'
password = y
subject = 'Everything you need to know...'
receiver = x
body = 'blah blah blahhh'

message = EmailMessage()
message["From"] = sender
message["To"] = receiver
message["Subject"] = subject

message.set_content(body)

context = ssl.create_default_context()
with smtplib.SMTP_SSL(host='smtp.gmail.com', port=465, context=context) as smtp:
    smtp.login(sender, password)
    smtp.send_message(message)  

print("Email has been sent!")
