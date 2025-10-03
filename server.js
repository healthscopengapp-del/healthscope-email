require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());

// Root route
app.get('/', (req, res) => {
  res.send('✅ Healthscope Email API is running');
});

// POST /send-email
app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Missing to, subject, or text' });
  }

  try {
    // Right now this will fail without SendGrid or SMTP,
    // but we’ll keep it in place for later.
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Healthscope App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });

    console.log('Message sent:', info.messageId);
    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error('Send failed:', err.message);
    res.status(500).json({ error: 'Email sending not set up yet' });
  }
});

// Use Render’s port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
