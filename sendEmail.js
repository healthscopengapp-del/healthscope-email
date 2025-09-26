require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendTestMail() {
  console.log("Using Gmail account:", process.env.SMTP_USER);
  console.log("Sending to:", process.env.TEST_RECIPIENT);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,          // TLS
    secure: false,      // use STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  try {
    const info = await transporter.sendMail({
      from: `"Healthscope App" <${process.env.SMTP_USER}>`,
      to: process.env.TEST_RECIPIENT,
      subject: 'Healthscope test email',
      text: 'This is a test email from Healthscope using Nodemailer',
      html: '<p>This is a test email from Healthscope using Nodemailer</p>'
    });

    console.log('Message sent:', info.messageId);
  } catch (err) {
    console.error('Send failed:', err);
  }
}

sendTestMail();
