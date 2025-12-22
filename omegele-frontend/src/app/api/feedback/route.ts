import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

// Create reusable transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "shivam@skytransportsolutions.com",
    pass: process.env.SMTP_PASSWORD || "bzpalynezkmjlfuc",
  },
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).userId;
    const body = await request.json();
    const { category, technicalPage, message } = body;

    // Validate required fields
    if (!category || !message || !message.trim()) {
      return NextResponse.json(
        { error: "Category and message are required" },
        { status: 400 }
      );
    }

    if (category === "technical" && !technicalPage) {
      return NextResponse.json(
        { error: "Technical page is required for technical issues" },
        { status: 400 }
      );
    }

    // Get user information
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        seniority: true,
        topics: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Format user information for email
    const userInfo = `
User Information:
- Name: ${user.name || "Not provided"}
- Email: ${user.email || "Not provided"}
- User ID: ${user.id}
- Seniority: ${user.seniority || "Not provided"}
- Topics: ${user.topics && user.topics.length > 0 ? user.topics.join(", ") : "Not provided"}
`;

    // Format feedback details
    const feedbackDetails = `
Feedback Details:
- Category: ${category.charAt(0).toUpperCase() + category.slice(1)}
${category === "technical" ? `- Page: ${technicalPage ? technicalPage.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Not specified"}` : ""}
- Message:
${message}
`;

    const fullDetails = userInfo + "\n" + feedbackDetails;

    // Email to user (thank you email)
    const userEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #ffd447 0%, #facc15 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
    .details { background: #fff; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #ffd447; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #18120b; margin: 0;">Thank You for Your Feedback!</h1>
    </div>
    <div class="content">
      <p>Dear ${user.name || "Valued User"},</p>
      
      <p>We really appreciate you taking out time to do this for us. We will grow and one day we will be huge, and we will remember you then.</p>
      
      <div class="details">
        <h3 style="margin-top: 0; color: #0b1018;">Your Feedback Details:</h3>
        <p><strong>Category:</strong> ${category.charAt(0).toUpperCase() + category.slice(1)}</p>
        ${category === "technical" ? `<p><strong>Page:</strong> ${technicalPage ? technicalPage.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Not specified"}</p>` : ""}
        <p><strong>Your Message:</strong></p>
        <p style="white-space: pre-wrap; background: #f8f9fa; padding: 15px; border-radius: 5px;">${message}</p>
      </div>
      
      <p>Your feedback is invaluable to us and helps us improve TechConnect Live for everyone. We're committed to building something great, and supporters like you make all the difference.</p>
      
      <p>Best regards,<br>The TechConnect Live Team</p>
    </div>
    <div class="footer">
      <p>This is an automated confirmation email. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>
    `;

    const userEmailText = `
Thank You for Your Feedback!

Dear ${user.name || "Valued User"},

We really appreciate you taking out time to do this for us. We will grow and one day we will be huge, and we will remember you then.

Your Feedback Details:
- Category: ${category.charAt(0).toUpperCase() + category.slice(1)}
${category === "technical" ? `- Page: ${technicalPage ? technicalPage.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Not specified"}` : ""}
- Your Message:
${message}

Your feedback is invaluable to us and helps us improve TechConnect Live for everyone. We're committed to building something great, and supporters like you make all the difference.

Best regards,
The TechConnect Live Team
    `;

    // Email to admin (with all details)
    const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0b1018 0%, #151f35 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; color: #f8f3e8; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
    .section { background: #fff; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #0b1018; }
    .label { font-weight: bold; color: #0b1018; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">New Feedback Submission</h1>
    </div>
    <div class="content">
      <div class="section">
        <h3 style="margin-top: 0; color: #0b1018;">User Information</h3>
        <p><span class="label">Name:</span> ${user.name || "Not provided"}</p>
        <p><span class="label">Email:</span> ${user.email || "Not provided"}</p>
        <p><span class="label">User ID:</span> ${user.id}</p>
        <p><span class="label">Seniority:</span> ${user.seniority || "Not provided"}</p>
        <p><span class="label">Topics:</span> ${user.topics && user.topics.length > 0 ? user.topics.join(", ") : "Not provided"}</p>
      </div>
      
      <div class="section">
        <h3 style="margin-top: 0; color: #0b1018;">Feedback Details</h3>
        <p><span class="label">Category:</span> ${category.charAt(0).toUpperCase() + category.slice(1)}</p>
        ${category === "technical" ? `<p><span class="label">Page:</span> ${technicalPage ? technicalPage.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Not specified"}</p>` : ""}
        <p><span class="label">Message:</span></p>
        <p style="white-space: pre-wrap; background: #f8f9fa; padding: 15px; border-radius: 5px;">${message}</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const adminEmailText = fullDetails;

    const fromEmail = process.env.SMTP_USER || "shivam@skytransportsolutions.com";
    const adminEmail = process.env.ADMIN_EMAIL || "shivam@skytransportsolutions.com";

    // Send email to user
    if (user.email) {
      await transporter.sendMail({
        from: fromEmail,
        to: user.email,
        cc: adminEmail,
        subject: "Thank You for Your Feedback - TechConnect Live",
        text: userEmailText,
        html: userEmailHtml,
      });
    }

    // Send email to admin
    await transporter.sendMail({
      from: fromEmail,
      to: adminEmail,
      subject: `New Feedback: ${category.charAt(0).toUpperCase() + category.slice(1)} - TechConnect Live`,
      text: adminEmailText,
      html: adminEmailHtml,
    });

    return NextResponse.json({ success: true, message: "Feedback submitted successfully" });
  } catch (error: any) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to submit feedback",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

