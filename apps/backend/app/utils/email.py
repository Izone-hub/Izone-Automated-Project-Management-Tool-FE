import os
from dotenv import load_dotenv
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

# Load the .env file explicitly
load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM", os.getenv("MAIL_USERNAME")), # Fallback to username
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_HOST"), # Matches your .env MAIL_HOST
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

fast_mail = FastMail(conf)


async def send_invitation_email(
    email: str,
    workspace_name: str,
    invite_link: str
):
    message = MessageSchema(
        subject=f"You're invited to join {workspace_name}",
        recipients=[email],
        body=f"""
Hello,

You have been invited to join the workspace: {workspace_name}.

Click the link below to accept the invitation:

{invite_link}

If you did not expect this invitation, you can ignore this email.

Best regards,
Your Team
        """,
        subtype="plain"
    )

    await fast_mail.send_message(message)
