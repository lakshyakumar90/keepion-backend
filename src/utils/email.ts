import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${
    process.env.CLIENT_URL || "http://localhost:3000"
  }/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email address",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your email</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 20px;">
          <tr>
            <td align="center">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td style="background-color: #18181b; padding: 24px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 2px;">KEEPION</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 32px;">
                    <h2 style="margin: 0 0 16px 0; color: #18181b; font-size: 24px; font-weight: 600;">Verify your email address</h2>
                    <p style="margin: 0 0 24px 0; color: #52525b; font-size: 16px; line-height: 1.5;">
                      Thanks for signing up for Keepion! We're excited to have you on board. Please verify your email address to get full access to your account.
                    </p>
                    
                    <!-- Button -->
                    <table border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                      <tr>
                        <td align="center" style="border-radius: 6px;" bgcolor="#000000">
                          <a href="${verificationUrl}" target="_blank" style="font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 6px; border: 1px solid #000000; display: inline-block; background-color: #000000;">
                            Verify Email
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 0 0 16px 0; color: #52525b; font-size: 14px; line-height: 1.5;">
                      Or copy and paste this link into your browser:
                    </p>
                    <p style="margin: 0; word-break: break-all;">
                      <a href="${verificationUrl}" style="color: #2563eb; font-size: 14px; text-decoration: underline;">${verificationUrl}</a>
                    </p>
                    
                    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e4e4e7;">
                      <p style="margin: 0; color: #71717a; font-size: 14px;">
                        This link will expire in 24 hours. If you didn't create an account with Keepion, you can safely ignore this email.
                      </p>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #fafafa; padding: 24px; text-align: center;">
                    <p style="margin: 0; color: #a1a1aa; font-size: 12px;">
                      &copy; ${new Date().getFullYear()} Keepion. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to", email);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};
