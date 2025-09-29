const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(
  "mongodb+srv://meenakshi:98765@cluster0.v61yjgl.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0"
).then(() => {
  console.log("✅ Connected to database..");
}).catch((err) => {
  console.error("❌ Failed to connect:", err.message);
});

// Schema-less model for credentials
const Credential = mongoose.model("credential", {}, "bmail");

// API endpoint
app.post("/sendbmail", async (req, res) => {
  try {
    const { msg, emailList } = req.body;

    if (!msg || !emailList || emailList.length === 0) {
      return res.status(400).json({ success: false, error: "Message or email list missing" });
    }

    const creds = await Credential.findOne();
    if (!creds) {
      return res.status(500).json({ success: false, error: "No credentials found in DB" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: creds.user,
        pass: creds.pass,
      },
    });

    for (let i = 0; i < emailList.length; i++) {
      await transporter.sendMail({
        from: creds.user,
        to: emailList[i],
        subject: "A message from bmail",
        text: msg,
      });
      console.log("📧 Email sent to: " + emailList[i]);
    }

    res.json({ success: true, message: "Emails sent successfully" });

  } catch (err) {
    console.error("❌ Mail error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Render requires process.env.PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server Started on port ${PORT}`);
});
