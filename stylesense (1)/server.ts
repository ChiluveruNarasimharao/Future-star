import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("stylesense.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    style_preference TEXT,
    body_type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS saved_outfits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    outfit_json TEXT,
    occasion TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/user/:id", (req, res) => {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
    res.json(user || { error: "User not found" });
  });

  app.post("/api/user", (req, res) => {
    const { name, style_preference, body_type } = req.body;
    const info = db.prepare("INSERT INTO users (name, style_preference, body_type) VALUES (?, ?, ?)").run(name, style_preference, body_type);
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/outfits/:userId", (req, res) => {
    const outfits = db.prepare("SELECT * FROM saved_outfits WHERE user_id = ?").all(req.params.userId);
    res.json(outfits);
  });

  app.post("/api/outfits", (req, res) => {
    const { userId, outfitJson, occasion } = req.body;
    const info = db.prepare("INSERT INTO saved_outfits (user_id, outfit_json, occasion) VALUES (?, ?, ?)").run(userId, outfitJson, occasion);
    res.json({ id: info.lastInsertRowid });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
