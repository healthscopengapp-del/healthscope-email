require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());

// POST /send-email
app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    // Create a test Ethereal account automatically
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    const info = await transporter.sendMail({
      from: '"Healthscope App" <test@example.com>',
      to: to || "ikchils@gmail.com",  // fallback to your email
      subject: subject || "Healthscope test (Ethereal)",
      text: text || "Hello from Healthscope Email Service (Ethereal)",
    });

    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

    res.json({
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info) // <- check this link in logs
    });

  } catch (err) {
    console.error('Send failed:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
