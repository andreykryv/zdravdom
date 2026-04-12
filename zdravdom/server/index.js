import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'articles.json');
const CONTENT_FILE = path.join(__dirname, 'data', 'site-content.json');
app.use(cors({ origin: '*' }));
app.use(express.json());


// ─── HELPERS ───────────────────────────────────────────────
async function readArticles() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeArticles(articles) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(articles, null, 2));
}

async function readContent() {
  try {
    const raw = await fs.readFile(CONTENT_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeContent(content) {
  await fs.mkdir(path.dirname(CONTENT_FILE), { recursive: true });
  await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2));
}

// ─── EMAIL ─────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

// ─── AUTH MIDDLEWARE ────────────────────────────────────────
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ─── ROUTES ────────────────────────────────────────────────

// Health check
app.get('/api/health', (_, res) => res.json({ ok: true }));

// Admin login
app.post('/api/admin/login', async (req, res) => {
  const { password } = req.body;
  const correct = await bcrypt.compare(password, await bcrypt.hash(process.env.ADMIN_PASSWORD, 10))
    .catch(() => password === process.env.ADMIN_PASSWORD);
  if (!correct && password !== process.env.ADMIN_PASSWORD)
    return res.status(401).json({ error: 'Неверный пароль' });
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

// Booking — send email
app.post('/api/book', async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Заполните все поля' });
  try {
    await transporter.sendMail({
      from: `"ЗдравДом" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO,
      subject: `🏥 Новая заявка от ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;padding:24px;background:#f5efe6;border-radius:12px">
          <h2 style="color:#1a2e1e;margin:0 0 16px">Новая заявка на приём</h2>
          <p style="margin:8px 0"><strong>Имя:</strong> ${name}</p>
          <p style="margin:8px 0"><strong>Телефон:</strong> <a href="tel:${phone}">${phone}</a></p>
          <p style="margin-top:20px;color:#6a6a5a;font-size:13px">Заявка с сайта ЗдравДом</p>
        </div>`,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Email error:', err.message);
    // Still return OK so user isn't stuck
    res.json({ ok: true, warning: 'email_failed' });
  }
});

// GET articles (public)
app.get('/api/articles', async (_, res) => {
  const articles = await readArticles();
  res.json(articles);
});

// GET single article (public)
app.get('/api/articles/:id', async (req, res) => {
  const articles = await readArticles();
  const article = articles.find(a => a.id === req.params.id);
  if (!article) return res.status(404).json({ error: 'Not found' });
  res.json(article);
});

// CREATE article (admin)
app.post('/api/articles', authMiddleware, async (req, res) => {
  const { tag, title, excerpt, sections } = req.body;
  if (!title || !tag) return res.status(400).json({ error: 'title and tag required' });
  const articles = await readArticles();
  const article = {
    id: uuidv4(),
    tag,
    title,
    excerpt: excerpt || '',
    sections: sections || [],
    createdAt: new Date().toISOString(),
  };
  articles.unshift(article);
  await writeArticles(articles);
  res.status(201).json(article);
});

// UPDATE article (admin)
app.put('/api/articles/:id', authMiddleware, async (req, res) => {
  const articles = await readArticles();
  const idx = articles.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  articles[idx] = { ...articles[idx], ...req.body, id: articles[idx].id };
  await writeArticles(articles);
  res.json(articles[idx]);
});

// DELETE article (admin)
app.delete('/api/articles/:id', authMiddleware, async (req, res) => {
  let articles = await readArticles();
  articles = articles.filter(a => a.id !== req.params.id);
  await writeArticles(articles);
  res.json({ ok: true });
});

// GET site content (public)
app.get('/api/content', async (_, res) => {
  const content = await readContent();
  res.json(content);
});

// UPDATE site content (admin)
app.put('/api/content', authMiddleware, async (req, res) => {
  const newContent = req.body;
  await writeContent(newContent);
  res.json(newContent);
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));