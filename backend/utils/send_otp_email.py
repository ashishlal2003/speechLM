import smtplib
from email.mime.text import MIMEText
import os

def send_otp_email(to_email, otp_code):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")

    subject = "Tvarā Verification Code (Valid for 10 Minutes)"

    body = f"""
        Hello,

        Your One-Time Password (OTP) for verifying your Tvarā account is:

        👉 {otp_code}

        This code is valid for 10 minutes. Please do not share it with anyone.

        — Tvarā Team
        Your Agentic AI Buddy

        ---

        This is an automated message. Please do not reply to this email.
        """


    msg = MIMEText(body.strip())
    msg['Subject'] = subject
    msg['From'] = smtp_user
    msg['To'] = to_email

    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)

