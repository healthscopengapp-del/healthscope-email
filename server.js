require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

// POST /send-email
app.post("/send-email", async (req, res) => {
  try {
    // Create a test account (Ethereal)
    let testAccount = await nodemailer.createTestAccount();

    // Create a transporter using Ethereal
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const { to, subject, text } = req.body;

    // Send mail
    let info = await transporter.sendMail({
      from: '"Healthscope Mailer" <no-reply@healthscope.com>',
      to,
      subject,
      text,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.json({
      message: "Email sent (Ethereal test)",
      previewUrl: nodemailer.getTestMessageUrl(info),
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Port (Render sets PORT in env)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
