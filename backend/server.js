import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000;

// ESM用 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 中間ウェア設定
app.use(cors());
app.use(express.json());

// ✅ React(Vite)でビルドした静的ファイルを配信
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// すべてのルートで index.html を返す（SPA対応）
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
