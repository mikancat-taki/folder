import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000;

// ESM 用 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB設定
const dbPath = path.join(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath);

// テーブル作成
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS emails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS folders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      color TEXT,
      icon TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Middleware
app.use(cors());
app.use(express.json());

// ✅ API: メール登録
app.post("/api/register", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  db.run(`INSERT OR IGNORE INTO emails(address) VALUES(?)`, [email], (err) => {
    if (err) return res.status(500).json({ error: "DB error" });
    return res.json({ message: "Registered successfully", email });
  });
});

// ✅ API: 登録済みメール一覧
app.get("/api/emails", (req, res) => {
  db.all(`SELECT * FROM emails ORDER BY created_at DESC`, (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(rows);
  });
});

// ✅ API: フォルダー作成
app.post("/api/folders", (req, res) => {
  const { name, color, icon } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });

  db.run(
    `INSERT INTO folders(name, color, icon) VALUES (?, ?, ?)`,
    [name, color || "#888", icon || "📁"],
    function (err) {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json({ id: this.lastID, name, color, icon });
    }
  );
});

// ✅ API: フォルダー一覧取得
app.get("/api/folders", (req, res) => {
  db.all(`SELECT * FROM folders ORDER BY created_at DESC`, (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(rows);
  });
});

// ✅ 静的ファイル配信（フロントエンド）
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API available at http://localhost:${PORT}/api`);
});
