import nodemailer from "nodemailer";

// Validate required environment variables
function getEmailConfig() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;

  if (!host || !port || !user || !password) {
    throw new Error(
      "Missing required SMTP environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD"
    );
  }

  return {
    host,
    port: parseInt(port, 10),
    secure: false, // true for 465, false for other ports
    auth: {
      user,
      pass: password,
    },
    tls: {
      // Do not fail on invalid certificates
      rejectUnauthorized: false,
    },
    // Connection timeout
    connectionTimeout: 10000, // 10 seconds
    // Socket timeout
    socketTimeout: 10000, // 10 seconds
    // Debug mode in development
    debug: process.env.NODE_ENV === "development",
    logger: process.env.NODE_ENV === "development",
  };
}

// Create reusable transporter using environment variables
// This will throw an error if required env vars are missing
export const emailTransporter = nodemailer.createTransport(getEmailConfig());

export interface WelcomeEmailParams {
  email: string;
  firstName: string;
}

/**
 * Sends a welcome email to a new user
 */
export async function sendWelcomeEmail({ email, firstName }: WelcomeEmailParams): Promise<void> {
  const fromEmail = process.env.SMTP_USER;
  
  if (!fromEmail) {
    throw new Error("SMTP_USER environment variable is required");
  }

  // Format sender name with proper display name
  const fromName = "Shivam - Vinamah.com Founder";
  const fromAddress = `${fromName} <${fromEmail}>`;

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .email-container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      margin-bottom: 30px;
    }
    .content {
      color: #333;
      font-size: 16px;
      line-height: 1.8;
    }
    .signature {
      margin-top: 40px;
      padding-top: 30px;
      border-top: 1px solid #e0e0e0;
    }
    .signature-name {
      font-weight: 600;
      margin-top: 20px;
    }
    .signature-title {
      color: #666;
      font-size: 14px;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="content">
      <p>Hi ${firstName},</p>
      
      <p>Welcome to Vinamah.</p>
      
      <p>I'm genuinely happy to have you here. Thank you for taking the time to sign up and for trusting something that's still being built.</p>
      
      <p>This platform comes from a simple idea — real people deserve real conversations. I'm working on Vinamah every day to make it more meaningful, more human, and more effective for professionals who just want to connect without noise.</p>
      
      <p>I won't promise perfection, but I do promise effort, honesty, and continuous improvement. Your trust matters to me, and one day I hope to give you something truly valuable in return for it.</p>
      
      <p>Thank you for being here.</p>
      
      <div class="signature">
        <div class="signature-name">— Shivam</div>
        <div class="signature-title">Founder, Vinamah</div>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const emailText = `Hi ${firstName},

Welcome to Vinamah.

I'm genuinely happy to have you here. Thank you for taking the time to sign up and for trusting something that's still being built.

This platform comes from a simple idea — real people deserve real conversations. I'm working on Vinamah every day to make it more meaningful, more human, and more effective for professionals who just want to connect without noise.

I won't promise perfection, but I do promise effort, honesty, and continuous improvement. Your trust matters to me, and one day I hope to give you something truly valuable in return for it.

Thank you for being here.

— Shivam
Founder, Vinamah`;

  try {
    await emailTransporter.sendMail({
      from: fromAddress,
      to: email,
      subject: "Welcome to Vinamah",
      text: emailText,
      html: emailHtml,
    });
    console.log(`Welcome email sent successfully to: ${email}`);
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    // Don't throw - we don't want to break user registration if email fails
    throw error;
  }
}

