require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');

const app = express();
app.use(bodyParser.json());

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

  const msg = {
    to,
    from: process.env.SENDGRID_FROM, // must be a verified sender in SendGrid
    subject,
    text,
  };

  try {
    const response = await sgMail.send(msg);
    console.log('Email sent:', response[0].statusCode);
    res.json({ success: true });
  } catch (err) {
    console.error('Send failed:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
