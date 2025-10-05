require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());

// SendGrid transport
const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    api_key: process.env.SENDGRID_API_KEY,
  },
});

// POST /send-email
app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Missing to, subject, or text' });
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      text,
    });

    console.log('Message sent:', info);
    res.json({ success: true, message: info });
  } catch (err) {
    console.error('Send failed:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
