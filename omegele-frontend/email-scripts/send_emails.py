#!/usr/bin/env python3
"""
Email Sender Script
Sends emails to all users in the User table using SMTP configuration.
"""

import os
import sys
import time
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from urllib.parse import urlparse
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env file in parent directory
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(env_path)

# SMTP Configuration
SMTP_HOST = "box.skytransportsolutions.com"
SMTP_PORT = 587
SMTP_USER = "shivam@mail.vinamah.com"
SMTP_PASSWORD = "Vinamah@Tracy@1"
FROM_EMAIL = "shivam@mail.vinamah.com"

# Email content (customize as needed)
EMAIL_SUBJECT = "Important Update from Omegele"
EMAIL_BODY = """
Hello,

This is an important message from Omegele.

Thank you for being part of our community!

Best regards,
The Omegele Team
"""


def parse_database_url(database_url):
    """Parse PostgreSQL connection URL into connection parameters."""
    parsed = urlparse(database_url)
    
    # Handle URL-encoded password
    password = parsed.password
    if password:
        from urllib.parse import unquote
        password = unquote(password)
    
    return {
        'host': parsed.hostname,
        'port': parsed.port or 5432,
        'database': parsed.path[1:],  # Remove leading '/'
        'user': parsed.username,
        'password': password
    }


def get_users_from_database():
    """Fetch all users with email addresses from the database."""
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        print("Error: DATABASE_URL not found in environment variables")
        sys.exit(1)
    
    try:
        # Parse database URL
        db_params = parse_database_url(database_url)
        
        # Connect to database
        print(f"Connecting to database at {db_params['host']}...")
        conn = psycopg2.connect(**db_params)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Query users with email addresses
        query = "SELECT id, email, name FROM \"User\" WHERE email IS NOT NULL AND email != ''"
        cursor.execute(query)
        users = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        print(f"Found {len(users)} users with email addresses")
        return users
        
    except Exception as e:
        print(f"Error connecting to database: {e}")
        sys.exit(1)


def send_email(to_email, to_name=None, subject=EMAIL_SUBJECT, body=EMAIL_BODY):
    """Send an email using SMTP."""
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = FROM_EMAIL
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Add body to email
        msg.attach(MIMEText(body, 'plain'))
        
        # Create SMTP session
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.starttls()  # Enable TLS encryption
        server.login(SMTP_USER, SMTP_PASSWORD)
        
        # Send email
        text = msg.as_string()
        server.sendmail(FROM_EMAIL, to_email, text)
        server.quit()
        
        return True, None
        
    except Exception as e:
        return False, str(e)


def send_test_email():
    """Send a test email to a manually provided email address."""
    print("\n" + "=" * 60)
    print("Test Email")
    print("=" * 60)
    print()
    print(f"SMTP Server: {SMTP_HOST}:{SMTP_PORT}")
    print(f"From: {FROM_EMAIL}")
    print(f"Subject: {EMAIL_SUBJECT}")
    print()
    
    # Get email address from user
    test_email = input("Enter email address to send test email to: ").strip()
    
    if not test_email:
        print("No email address provided. Cancelled.")
        return
    
    # Validate email format (basic check)
    if '@' not in test_email or '.' not in test_email.split('@')[1]:
        print("Invalid email format. Please enter a valid email address.")
        return
    
    # Ask for confirmation
    print(f"\nReady to send test email to: {test_email}")
    response = input("Proceed? (yes/no): ").strip().lower()
    if response not in ['yes', 'y']:
        print("Cancelled.")
        return
    
    # Send test email
    print(f"\nSending test email to {test_email}...")
    success, error = send_email(test_email)
    
    if success:
        print("✓ Test email sent successfully!")
    else:
        print(f"✗ Failed to send test email: {error}")


def send_bulk_emails():
    """Send emails to all users in the database."""
    print("\n" + "=" * 60)
    print("Bulk Email Sender")
    print("=" * 60)
    print()
    
    # Get users from database
    users = get_users_from_database()
    
    if not users:
        print("No users found with email addresses.")
        return
    
    # Ask for confirmation
    print(f"\nReady to send emails to {len(users)} users.")
    print(f"SMTP Server: {SMTP_HOST}:{SMTP_PORT}")
    print(f"From: {FROM_EMAIL}")
    print(f"Subject: {EMAIL_SUBJECT}")
    print()
    
    response = input("Do you want to proceed? (yes/no): ").strip().lower()
    if response not in ['yes', 'y']:
        print("Cancelled.")
        return
    
    # Send emails
    print("\nSending emails...")
    print("-" * 60)
    
    success_count = 0
    failure_count = 0
    failures = []
    
    for i, user in enumerate(users, 1):
        email = user['email']
        name = user.get('name', 'User')
        user_id = user['id']
        
        print(f"[{i}/{len(users)}] Sending to {email}...", end=' ')
        
        success, error = send_email(email, name)
        
        if success:
            print("✓ Sent")
            success_count += 1
        else:
            print(f"✗ Failed: {error}")
            failure_count += 1
            failures.append({
                'email': email,
                'name': name,
                'id': user_id,
                'error': error
            })
        
        # Wait 10 seconds before sending next email (except for the last one)
        if i < len(users):
            print("Waiting 10 seconds before next email...")
            time.sleep(10)
    
    # Summary
    print()
    print("=" * 60)
    print("Summary")
    print("=" * 60)
    print(f"Total users: {len(users)}")
    print(f"Successfully sent: {success_count}")
    print(f"Failed: {failure_count}")
    
    if failures:
        print("\nFailed emails:")
        for failure in failures:
            print(f"  - {failure['email']}: {failure['error']}")


def show_menu():
    """Display the main menu and handle user selection."""
    while True:
        print("\n" + "=" * 60)
        print("Email Sender Script")
        print("=" * 60)
        print()
        print("1. Send test email to a single address")
        print("2. Send emails to all users in database")
        print("3. Exit")
        print()
        
        choice = input("Select an option (1-3): ").strip()
        
        if choice == '1':
            send_test_email()
        elif choice == '2':
            send_bulk_emails()
        elif choice == '3':
            print("\nGoodbye!")
            break
        else:
            print("\nInvalid option. Please select 1, 2, or 3.")


def main():
    """Main function."""
    show_menu()


if __name__ == "__main__":
    main()
