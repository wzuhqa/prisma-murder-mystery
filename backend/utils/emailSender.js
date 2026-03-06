const nodemailer = require('nodemailer');

// ─── Transporter ────────────────────────────────────────────────────────────
// Using Gmail SMTP.  For production, consider SendGrid / Mailgun for higher
// delivery rates.  App Password is required if 2FA is enabled on Gmail.
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS  // Gmail App Password  (not your actual password)
    }
  });
};

// ─── Helper: format price ────────────────────────────────────────────────────
const formatPrice = (paise) => `₹${(paise / 100).toFixed(2)}`;

// ─── Send Booking Confirmation Email ────────────────────────────────────────
/**
 * @param {object} options
 * @param {string} options.toEmail        - Recipient email
 * @param {string} options.userName       - Recipient name
 * @param {object} options.event          - Populated Event document
 * @param {string} options.ticketId       - Unique ticket UUID
 * @param {string} options.qrCodeBase64   - Base64 PNG data URL from qrGenerator
 * @param {number} options.quantity       - Number of passes purchased
 * @param {number} options.totalAmount    - Total in paise
 */
const sendBookingConfirmation = async ({
  toEmail,
  userName,
  event,
  ticketId,
  qrCodeBase64,
  quantity,
  totalAmount
}) => {
  const transporter = createTransporter();

  const eventDate = new Date(event.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Extract the actual base64 data (strip the "data:image/png;base64," prefix)
  const base64Data = qrCodeBase64.replace(/^data:image\/png;base64,/, '');

  const mailOptions = {
    from: `"Prisma Murder Mystery" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `🎭 Your Ticket Confirmed — ${event.title}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Ticket Confirmation</title>
</head>
<body style="margin:0;padding:0;background:#0d0208;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0208;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="background:#1a0a0a;border:1px solid #5c1a1a;border-radius:8px;overflow:hidden;max-width:600px;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#3d0000,#1a0a0a);padding:36px 40px;text-align:center;">
              <h1 style="color:#c9a96e;font-size:28px;letter-spacing:4px;margin:0;text-transform:uppercase;">
                🔍 CASE CONFIRMED
              </h1>
              <p style="color:#8b6914;margin:8px 0 0;font-size:13px;letter-spacing:2px;">
                YOUR PASS HAS BEEN ISSUED
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:32px 40px 0;">
              <p style="color:#d4c5a9;font-size:16px;line-height:1.8;margin:0;">
                Dear Detective <strong style="color:#c9a96e;">${userName}</strong>,
              </p>
              <p style="color:#a89070;font-size:14px;line-height:1.8;margin:16px 0 0;">
                Your involvement in <em>${event.title}</em> has been approved.
                Present the QR code below at the entrance. Do not share it — each code admits
                the registered attendee only.
              </p>
            </td>
          </tr>

          <!-- Event Details -->
          <tr>
            <td style="padding:28px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#0d0208;border:1px solid #3d1a0a;border-radius:6px;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #2a0f0f;">
                    <p style="color:#8b4513;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Event</p>
                    <p style="color:#d4c5a9;font-size:17px;font-weight:bold;margin:0;">${event.title}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px;border-bottom:1px solid #2a0f0f;">
                    <p style="color:#8b4513;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Date</p>
                    <p style="color:#d4c5a9;font-size:15px;margin:0;">${eventDate}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px;border-bottom:1px solid #2a0f0f;">
                    <p style="color:#8b4513;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Passes</p>
                    <p style="color:#d4c5a9;font-size:15px;margin:0;">${quantity}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px;">
                    <p style="color:#8b4513;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Amount Paid</p>
                    <p style="color:#c9a96e;font-size:18px;font-weight:bold;margin:0;">${formatPrice(totalAmount)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Ticket ID -->
          <tr>
            <td style="padding:28px 40px 0;">
              <p style="color:#8b4513;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Ticket ID</p>
              <div style="background:#0d0208;border:1px dashed #5c1a1a;border-radius:4px;padding:14px 20px;">
                <code style="color:#c9a96e;font-size:13px;letter-spacing:1px;word-break:break-all;">${ticketId}</code>
              </div>
            </td>
          </tr>

          <!-- QR Code -->
          <tr>
            <td style="padding:28px 40px;text-align:center;">
              <p style="color:#8b4513;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px;">Your Entry Pass</p>
              <img src="cid:qrcode" alt="QR Code"
                   style="width:220px;height:220px;border:4px solid #5c1a1a;border-radius:8px;display:block;margin:0 auto;" />
              <p style="color:#6b5030;font-size:12px;margin:12px 0 0;">
                Scan at the entrance on the event day
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0d0208;border-top:1px solid #3d1a0a;padding:24px 40px;text-align:center;">
              <p style="color:#5c3a1a;font-size:12px;margin:0;line-height:1.6;">
                This is an automated confirmation. Do not reply.<br/>
                © 2026 Prisma Murder Mystery · All rights reserved.
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
    attachments: [
      {
        filename: 'ticket-qr.png',
        content: base64Data,
        encoding: 'base64',
        cid: 'qrcode' // Referenced in the HTML img tag above
      }
    ]
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[Email] Confirmation sent to ${toEmail} — MessageId: ${info.messageId}`);
  return info;
};

module.exports = { sendBookingConfirmation };
