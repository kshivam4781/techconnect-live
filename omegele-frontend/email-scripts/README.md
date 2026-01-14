# Email Sender Script

This script sends emails to all users in the User table using SMTP configuration.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Make sure you have a `.env` file in the parent directory (`omegele-frontend/.env`) with the `DATABASE_URL` variable.

## Usage

Run the script:
```bash
python send_emails.py
```

The script will:
1. Connect to the database using `DATABASE_URL` from the `.env` file
2. Fetch all users with email addresses
3. Ask for confirmation before sending
4. Send emails to all users using the configured SMTP server
5. Display a summary of successful and failed sends

## Configuration

The SMTP configuration is hardcoded in the script:
- SMTP_HOST: box.skytransportsolutions.com
- SMTP_PORT: 587
- SMTP_USER: shivam@mail.vinamah.com
- FROM_EMAIL: shivam@mail.vinamah.com

## Customizing Email Content

Edit the `EMAIL_SUBJECT` and `EMAIL_BODY` variables in `send_emails.py` to customize the email content.
