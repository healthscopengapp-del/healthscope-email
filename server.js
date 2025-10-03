require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.json());

// Root route for testing in browser
app.get("/", (req, res) => {
  res.send("✅ Healthscope Email API is running. Use POST /send-email to send emails.");
});

// POST /send-email
app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: "Missing to, subject, or text" });
  }

  try {
    // Use Gmail (needs App Password) or fallback to Ethereal for testing
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
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

    console.log("Message sent:", info.messageId);
    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error("Send failed:", err);
    res.status(500).json({ error: "Failed to send email", details: err.message });
  }
});

// Use Render’s dynamic PORT or fallback to 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
