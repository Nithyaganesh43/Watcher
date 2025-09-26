const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
};

const transporter = createTransporter();

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: {
        name: 'Watchtower 24/7',
        address: process.env.EMAIL_ID,
      },
      to: to.toLowerCase().trim(),
      subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};
const generateVerificationEmail = (token, email) => {
  const verificationUrl = `https://watchtower-24-7.vercel.app/verify?token=${token}`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Verify Your Device - Watch Tower 24/7</title>
        <!--[if mso]>
        <noscript>
            <xml>
                <o:OfficeDocumentSettings>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
        </noscript>
        <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc; min-height: 100vh;">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 32px 40px; text-align: center;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td align="center">
                                            <img src="https://res.cloudinary.com/dflgxymvs/image/upload/v1753945877/lecrowninteriors/u7oimuieazrfxzv4sl5n.avif" 
                                                 alt="Watch Tower 24/7" 
                                                 width="48" 
                                                 height="48" 
                                                 style="display: block; border-radius: 8px; margin-bottom: 16px;">
                                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">
                                                Watch Tower 24/7
                                            </h1>
                                            <p style="margin: 8px 0 0 0; color: #bfdbfe; font-size: 16px; font-weight: 400;">
                                                Professional Server Monitoring
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px;">
                                <h2 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 600;">
                                    🔐 Verify Your Device
                                </h2>
                                
                                <p style="margin: 0 0 24px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                                    Hello,<br><br>
                                    We've received a request to verify a new device for your Watch Tower 24/7 account: <strong style="color: #1e293b;">${email}</strong>
                                </p>

                                <p style="margin: 0 0 32px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                                    Please click the button below to complete the verification process:
                                </p>

                                <!-- CTA Button -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td align="center" style="padding: 0 0 32px 0;">
                                            <a href="${verificationUrl}" 
                                               style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; text-align: center; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);">
                                                Verify Device
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Security Notice -->
                                <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                                    <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 500;">
                                        ⏰ <strong>Security Notice:</strong> This verification link will expire in 10 minutes for your security.
                                    </p>
                                </div>
 

                                <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.5;">
                                    If you didn't request this verification, please ignore this email or contact our support team.
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f1f5f9; padding: 24px 40px; border-top: 1px solid #e2e8f0;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td align="center">
                                            <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px;">
                                                Built with ❤️ by Nithya Ganesh
                                            </p>
                                            <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                                                © 2025 Watch Tower 24/7. All rights reserved.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
};

const generateServerDownAlert = (server, errorMessage) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>🚨 Server Alert - Watch Tower 24/7</title>
        <!--[if mso]>
        <noscript>
            <xml>
                <o:OfficeDocumentSettings>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
        </noscript>
        <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc; min-height: 100vh;">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 32px 40px; text-align: center;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td align="center">
                                            <img src="https://res.cloudinary.com/dflgxymvs/image/upload/v1753945877/lecrowninteriors/u7oimuieazrfxzv4sl5n.avif" 
                                                 alt="Watch Tower 24/7" 
                                                 width="48" 
                                                 height="48" 
                                                 style="display: block; border-radius: 8px; margin-bottom: 16px;">
                                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">
                                                Watch Tower 24/7
                                            </h1>
                                            <p style="margin: 8px 0 0 0; color: #fecaca; font-size: 16px; font-weight: 400;">
                                                Critical Server Alert
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Alert Banner -->
                        <tr>
                            <td style="background-color: #fef2f2; border-bottom: 3px solid #ef4444; padding: 20px 40px; text-align: center;">
                                <h2 style="margin: 0; color: #dc2626; font-size: 20px; font-weight: 700;">
                                    🚨 SERVER DOWN ALERT
                                </h2>
                            </td>
                        </tr>

                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px;">
                                <p style="margin: 0 0 24px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                                    <strong>Alert:</strong> One of your monitored servers has gone offline and requires immediate attention.
                                </p>

                                <!-- Server Details Card -->
                                <div style="background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tr>
                                            <td style="padding-bottom: 12px;">
                                                <strong style="color: #dc2626; font-size: 16px;">Server Details</strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; border-bottom: 1px solid #fca5a5;">
                                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                    <tr>
                                                        <td style="width: 120px; color: #7f1d1d; font-weight: 600; font-size: 14px;">Server URL:</td>
                                                        <td style="color: #1e293b; font-size: 14px; word-break: break-all;">${
                                                          server.url
                                                        }</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; border-bottom: 1px solid #fca5a5;">
                                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                    <tr>
                                                        <td style="width: 120px; color: #7f1d1d; font-weight: 600; font-size: 14px;">Status:</td>
                                                        <td style="color: #dc2626; font-weight: 700; font-size: 14px;">🔴 OFFLINE</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; border-bottom: 1px solid #fca5a5;">
                                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                    <tr>
                                                        <td style="width: 120px; color: #7f1d1d; font-weight: 600; font-size: 14px;">Alert Time:</td>
                                                        <td style="color: #1e293b; font-size: 14px;">${new Date().toLocaleString(
                                                          'en-US',
                                                          {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            timeZoneName:
                                                              'short',
                                                          }
                                                        )}</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; ${
                                              errorMessage
                                                ? 'border-bottom: 1px solid #fca5a5;'
                                                : ''
                                            }">
                                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                    <tr>
                                                        <td style="width: 120px; color: #7f1d1d; font-weight: 600; font-size: 14px;">Failed Attempts:</td>
                                                        <td style="color: #1e293b; font-size: 14px;">${
                                                          server.consecutiveFailures
                                                        }</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        ${
                                          errorMessage
                                            ? `
                                        <tr>
                                            <td style="padding: 8px 0;">
                                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                    <tr>
                                                        <td style="width: 120px; color: #7f1d1d; font-weight: 600; font-size: 14px; vertical-align: top; padding-top: 2px;">Error Details:</td>
                                                        <td style="color: #1e293b; font-size: 14px; word-break: break-word;">${errorMessage}</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        `
                                            : ''
                                        }
                                    </table>
                                </div>

                                <!-- Action Items -->
                                <div style="background-color: #f0f9ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                                    <h3 style="margin: 0 0 16px 0; color: #1e40af; font-size: 16px; font-weight: 600;">
                                        🔧 Recommended Actions
                                    </h3>
                                    <ul style="margin: 0; padding-left: 20px; color: #1e293b; font-size: 14px; line-height: 1.6;">
                                        <li style="margin-bottom: 8px;">Check server status and network connectivity</li>
                                        <li style="margin-bottom: 8px;">Verify server configuration and resources</li>
                                        <li style="margin-bottom: 8px;">Review server logs for error details</li>
                                        <li>Contact your hosting provider if issues persist</li>
                                    </ul>
                                </div>

                                <!-- Dashboard Link -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td align="center" style="padding: 0 0 24px 0;">
                                            <a href="https://watchtower-24-7.vercel.app/dashboard" 
                                               style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; text-align: center;">
                                                View Dashboard
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.5; text-align: center;">
                                    This is an automated alert from Watch Tower 24/7.<br>
                                    You're receiving this because you have monitoring enabled for this server.
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f1f5f9; padding: 24px 40px; border-top: 1px solid #e2e8f0;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td align="center">
                                            <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px;">
                                                Built with ❤️ by Nithya Ganesh
                                            </p>
                                            <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                                                © 2025 Watch Tower 24/7. All rights reserved.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
};

module.exports = {
  sendEmail,
  generateVerificationEmail,
  generateServerDownAlert,
};
