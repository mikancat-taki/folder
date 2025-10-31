import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
const DB_FILE = path.join("storage", "emails.json");
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());

// 📩 メール保存関数
function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8") || "[]");
  } catch {
    return [];
  }
}
function saveDB(arr) {
  fs.writeFileSync(DB_FILE, JSON.stringify(arr, null, 2));
}

// ✉️ nodemailer設定（任意）
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

// 📨 メール登録API
app.post("/register", async (req, res) => {
  const { email } = req.body || {};
  if (!email || !/^[^@\s]+@[^@\s]+\\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const db = readDB();
  if (db.find((e) => e.email === email)) {
    return res.status(409).json({ error: "Already registered" });
  }

  const record = { email, createdAt: new Date().toISOString() };
  db.push(record);
  saveDB(db);

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.FROM_ADDRESS || "VirtualFolder <no-reply@example.com>",
        to: email,
        subject: "VirtualFolder 登録完了",
        text: "VirtualFolderに登録ありがとうございます。",
      });
    } catch (err) {
      console.error("Mailer error:", err);
    }
  }

  res.json({ ok: true });
});

app.get("/list", (req, res) => {
  res.json(readDB());
});

// 🗂 フロントエンド静的ファイル配信
app.use(express.static(path.join(__dirname, "frontend", "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
