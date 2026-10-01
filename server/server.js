import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize SQLite database file in server directory
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Create SQL Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar TEXT,
    role TEXT NOT NULL,
    title TEXT,
    bio TEXT,
    skills TEXT,
    domains TEXT,
    location TEXT,
    availability TEXT,
    fundingCapacity TEXT,
    investmentStage TEXT,
    verified INTEGER DEFAULT 1,
    githubUrl TEXT,
    linkedinUrl TEXT,
    websiteUrl TEXT
  );

  CREATE TABLE IF NOT EXISTS ideas (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    domain TEXT NOT NULL,
    description TEXT NOT NULL,
    skillsNeeded TEXT,
    creatorId TEXT NOT NULL,
    creatorName TEXT NOT NULL,
    creatorAvatar TEXT,
    fundingNeeded TEXT,
    stage TEXT,
    createdAt TEXT,
    likesCount INTEGER DEFAULT 0,
    pitchDeckUrl TEXT,
    lookingFor TEXT
  );

  CREATE TABLE IF NOT EXISTS connections (
    id TEXT PRIMARY KEY,
    senderId TEXT NOT NULL,
    receiverId TEXT NOT NULL,
    ideaId TEXT,
    status TEXT NOT NULL,
    message TEXT,
    createdAt TEXT
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    connectionId TEXT NOT NULL,
    senderId TEXT NOT NULL,
    receiverId TEXT NOT NULL,
    text TEXT NOT NULL,
    timestamp TEXT,
    attachments TEXT
  );

  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    connectionId TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    url TEXT NOT NULL,
    uploadedBy TEXT NOT NULL,
    uploadedByName TEXT NOT NULL,
    uploadedAt TEXT,
    fileSize TEXT
  );

  CREATE TABLE IF NOT EXISTS milestones (
    id TEXT PRIMARY KEY,
    connectionId TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    assignedTo TEXT,
    assignedToName TEXT,
    dueDate TEXT,
    status TEXT NOT NULL
  );
`);

// Seed Data Definition
const initialUsers = [
  {
    id: "user_1",
    name: "Priya Sharma",
    email: "priya.sharma@agritech.io",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    role: "creator",
    title: "Domain Expert & Founder",
    bio: "Agricultural scientist with 8+ years researching crop disease computer vision models. Seeking a technical co-founder to build our mobile platform.",
    skills: ["AgriTech", "Product Strategy", "Computer Vision", "Farmer Outreach"],
    domains: ["AgriTech", "AI", "CleanTech"],
    location: "Bengaluru, India",
    availability: "Full-time (40h/wk)",
    verified: 1,
    linkedinUrl: "https://linkedin.com",
    websiteUrl: "https://priyasharma.agri",
  },
  {
    id: "user_2",
    name: "Alex Rivera",
    email: "alex.rivera@devstudio.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "cofounder",
    title: "Senior Full-Stack & Mobile Lead",
    bio: "Ex-Stripe Senior Software Engineer. Built 3 mobile apps to 100k+ MAU. Looking to join an early AgriTech or HealthTech startup with real impact.",
    skills: ["React Native", "Python", "PyTorch", "Node.js", "PostgreSQL"],
    domains: ["AgriTech", "HealthTech", "AI"],
    location: "San Francisco, CA",
    availability: "Full-time (40h/wk)",
    verified: 1,
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
  },
  {
    id: "user_3",
    name: "Marcus Vance",
    email: "marcus@vanceventures.vc",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "investor",
    title: "Partner at Vance Ventures",
    bio: "Early-stage angel and micro-VC backing pre-seed teams in AI, AgriTech, and FinTech. Writing $50k–$250k checks for balanced execution teams.",
    skills: ["Seed Investment", "Cap Table Structuring", "GTM Strategy"],
    domains: ["AgriTech", "FinTech", "AI", "CleanTech"],
    location: "New York, NY",
    fundingCapacity: "$50K - $250K",
    investmentStage: "Pre-seed / Seed",
    verified: 1,
    linkedinUrl: "https://linkedin.com",
  },
];

const initialIdeas = [
  {
    id: "1",
    title: "AI-Powered Crop Disease Detection",
    domain: "AgriTech",
    description: "Mobile app using computer vision to detect crop diseases early, helping farmers reduce losses by up to 40%. Uses satellite imagery and on-ground sensors.",
    skillsNeeded: ["Machine Learning", "React Native", "Python", "Agriculture"],
    creatorId: "user_1",
    creatorName: "Priya Sharma",
    creatorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    fundingNeeded: "$50K needed",
    stage: "Concept",
    createdAt: "2026-09-15",
    likesCount: 142,
    pitchDeckUrl: "https://example.com/pitch_agri_ai.pdf",
    lookingFor: ["Technical Co-Founder", "Angel Investor"],
  },
  {
    id: "2",
    title: "DeFi Lending for Small Businesses",
    domain: "FinTech",
    description: "Decentralized lending platform enabling small businesses in emerging markets to access microloans without traditional banking infrastructure.",
    skillsNeeded: ["Solidity", "React", "Node.js", "Finance"],
    creatorId: "user_4",
    creatorName: "James Chen",
    creatorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    fundingNeeded: "$200K needed",
    stage: "MVP Built",
    createdAt: "2026-09-18",
    likesCount: 98,
    pitchDeckUrl: "https://example.com/pitch_defilend.pdf",
    lookingFor: ["Business Co-Founder", "Seed VC"],
  },
];

const initialConnections = [
  {
    id: "conn_1",
    senderId: "user_2",
    receiverId: "user_1",
    ideaId: "1",
    status: "accepted",
    message: "Hi Priya! I saw your Crop Disease Detection project. I built computer vision models at Stripe and would love to collaborate as technical co-founder.",
    createdAt: "2026-09-26T10:00:00Z",
  },
];

const initialMessages = [
  {
    id: "msg_1",
    connectionId: "conn_1",
    senderId: "user_2",
    receiverId: "user_1",
    text: "Hey Priya! Great to connect. I reviewed the disease dataset requirements. We can spin up a fast PyTorch pipeline for satellite imagery.",
    timestamp: "10:30 AM",
    attachments: [],
  },
];

const initialDocuments = [
  {
    id: "doc_1",
    connectionId: "conn_1",
    title: "AgriTech Crop AI Architecture Overview",
    type: "Architecture Spec",
    url: "https://example.com/docs/arch_spec_v1.pdf",
    uploadedBy: "user_1",
    uploadedByName: "Priya Sharma",
    uploadedAt: "2026-09-27",
    fileSize: "2.4 MB",
  },
];

const initialMilestones = [
  {
    id: "ms_1",
    connectionId: "conn_1",
    title: "Draft Mobile & Model Architecture Spec",
    description: "Outline React Native frontend structure, PyTorch model API endpoints, and cloud inference pipeline.",
    assignedTo: "user_2",
    assignedToName: "Alex Rivera",
    dueDate: "2026-10-05",
    status: "completed",
  },
];

// Seed SQLite if empty
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
if (userCount === 0) {
  console.log('Seeding SQLite database file...');

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, avatar, role, title, bio, skills, domains, location, availability, fundingCapacity, investmentStage, verified, githubUrl, linkedinUrl, websiteUrl)
    VALUES (@id, @name, @email, @avatar, @role, @title, @bio, @skills, @domains, @location, @availability, @fundingCapacity, @investmentStage, @verified, @githubUrl, @linkedinUrl, @websiteUrl)
  `);

  initialUsers.forEach(u => {
    insertUser.run({
      ...u,
      skills: JSON.stringify(u.skills || []),
      domains: JSON.stringify(u.domains || []),
      verified: u.verified ? 1 : 0,
      availability: u.availability || null,
      fundingCapacity: u.fundingCapacity || null,
      investmentStage: u.investmentStage || null,
      githubUrl: u.githubUrl || null,
      linkedinUrl: u.linkedinUrl || null,
      websiteUrl: u.websiteUrl || null,
    });
  });

  const insertIdea = db.prepare(`
    INSERT INTO ideas (id, title, domain, description, skillsNeeded, creatorId, creatorName, creatorAvatar, fundingNeeded, stage, createdAt, likesCount, pitchDeckUrl, lookingFor)
    VALUES (@id, @title, @domain, @description, @skillsNeeded, @creatorId, @creatorName, @creatorAvatar, @fundingNeeded, @stage, @createdAt, @likesCount, @pitchDeckUrl, @lookingFor)
  `);

  initialIdeas.forEach(i => {
    insertIdea.run({
      ...i,
      skillsNeeded: JSON.stringify(i.skillsNeeded || []),
      lookingFor: JSON.stringify(i.lookingFor || []),
      creatorAvatar: i.creatorAvatar || null,
      fundingNeeded: i.fundingNeeded || null,
      pitchDeckUrl: i.pitchDeckUrl || null,
    });
  });

  const insertConn = db.prepare(`
    INSERT INTO connections (id, senderId, receiverId, ideaId, status, message, createdAt)
    VALUES (@id, @senderId, @receiverId, @ideaId, @status, @message, @createdAt)
  `);

  initialConnections.forEach(c => insertConn.run({ ...c, ideaId: c.ideaId || null }));

  const insertMsg = db.prepare(`
    INSERT INTO messages (id, connectionId, senderId, receiverId, text, timestamp, attachments)
    VALUES (@id, @connectionId, @senderId, @receiverId, @text, @timestamp, @attachments)
  `);

  initialMessages.forEach(m => insertMsg.run({ ...m, attachments: JSON.stringify(m.attachments || []) }));

  const insertDoc = db.prepare(`
    INSERT INTO documents (id, connectionId, title, type, url, uploadedBy, uploadedByName, uploadedAt, fileSize)
    VALUES (@id, @connectionId, @title, @type, @url, @uploadedBy, @uploadedByName, @uploadedAt, @fileSize)
  `);

  initialDocuments.forEach(d => insertDoc.run(d));

  const insertMs = db.prepare(`
    INSERT INTO milestones (id, connectionId, title, description, assignedTo, assignedToName, dueDate, status)
    VALUES (@id, @connectionId, @title, @description, @assignedTo, @assignedToName, @dueDate, @status)
  `);

  initialMilestones.forEach(m => insertMs.run(m));
}

// REST API Endpoints

// USERS
app.get('/api/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  const parsed = users.map(u => ({
    ...u,
    skills: JSON.parse(u.skills || '[]'),
    domains: JSON.parse(u.domains || '[]'),
    verified: Boolean(u.verified),
  }));
  res.json(parsed);
});

app.post('/api/users', (req, res) => {
  const u = req.body;
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, avatar, role, title, bio, skills, domains, location, availability, fundingCapacity, investmentStage, verified)
    VALUES (@id, @name, @email, @avatar, @role, @title, @bio, @skills, @domains, @location, @availability, @fundingCapacity, @investmentStage, @verified)
  `);
  insertUser.run({
    ...u,
    skills: JSON.stringify(u.skills || []),
    domains: JSON.stringify(u.domains || []),
    verified: u.verified ? 1 : 0,
    availability: u.availability || null,
    fundingCapacity: u.fundingCapacity || null,
    investmentStage: u.investmentStage || null,
  });
  res.status(201).json(u);
});

// IDEAS
app.get('/api/ideas', (req, res) => {
  const ideas = db.prepare('SELECT * FROM ideas ORDER BY createdAt DESC').all();
  const parsed = ideas.map(i => ({
    ...i,
    skillsNeeded: JSON.parse(i.skillsNeeded || '[]'),
    lookingFor: JSON.parse(i.lookingFor || '[]'),
  }));
  res.json(parsed);
});

app.post('/api/ideas', (req, res) => {
  const i = req.body;
  const insertIdea = db.prepare(`
    INSERT INTO ideas (id, title, domain, description, skillsNeeded, creatorId, creatorName, creatorAvatar, fundingNeeded, stage, createdAt, likesCount, pitchDeckUrl, lookingFor)
    VALUES (@id, @title, @domain, @description, @skillsNeeded, @creatorId, @creatorName, @creatorAvatar, @fundingNeeded, @stage, @createdAt, @likesCount, @pitchDeckUrl, @lookingFor)
  `);
  insertIdea.run({
    ...i,
    skillsNeeded: JSON.stringify(i.skillsNeeded || []),
    lookingFor: JSON.stringify(i.lookingFor || []),
    creatorAvatar: i.creatorAvatar || null,
    fundingNeeded: i.fundingNeeded || null,
    pitchDeckUrl: i.pitchDeckUrl || null,
  });
  res.status(201).json(i);
});

app.put('/api/ideas/:id/like', (req, res) => {
  const { id } = req.params;
  db.prepare('UPDATE ideas SET likesCount = likesCount + 1 WHERE id = ?').run(id);
  res.json({ success: true });
});

// CONNECTIONS
app.get('/api/connections', (req, res) => {
  const conns = db.prepare('SELECT * FROM connections').all();
  res.json(conns);
});

app.post('/api/connections', (req, res) => {
  const c = req.body;
  db.prepare(`
    INSERT INTO connections (id, senderId, receiverId, ideaId, status, message, createdAt)
    VALUES (@id, @senderId, @receiverId, @ideaId, @status, @message, @createdAt)
  `).run({ ...c, ideaId: c.ideaId || null });
  res.status(201).json(c);
});

app.put('/api/connections/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.prepare('UPDATE connections SET status = ? WHERE id = ?').run(status, id);
  res.json({ success: true });
});

// MESSAGES
app.get('/api/messages', (req, res) => {
  const msgs = db.prepare('SELECT * FROM messages').all();
  const parsed = msgs.map(m => ({
    ...m,
    attachments: JSON.parse(m.attachments || '[]'),
  }));
  res.json(parsed);
});

app.post('/api/messages', (req, res) => {
  const m = req.body;
  db.prepare(`
    INSERT INTO messages (id, connectionId, senderId, receiverId, text, timestamp, attachments)
    VALUES (@id, @connectionId, @senderId, @receiverId, @text, @timestamp, @attachments)
  `).run({ ...m, attachments: JSON.stringify(m.attachments || []) });
  res.status(201).json(m);
});

// DOCUMENTS
app.get('/api/documents', (req, res) => {
  const docs = db.prepare('SELECT * FROM documents').all();
  res.json(docs);
});

app.post('/api/documents', (req, res) => {
  const d = req.body;
  db.prepare(`
    INSERT INTO documents (id, connectionId, title, type, url, uploadedBy, uploadedByName, uploadedAt, fileSize)
    VALUES (@id, @connectionId, @title, @type, @url, @uploadedBy, @uploadedByName, @uploadedAt, @fileSize)
  `).run(d);
  res.status(201).json(d);
});

// MILESTONES
app.get('/api/milestones', (req, res) => {
  const ms = db.prepare('SELECT * FROM milestones').all();
  res.json(ms);
});

app.post('/api/milestones', (req, res) => {
  const m = req.body;
  db.prepare(`
    INSERT INTO milestones (id, connectionId, title, description, assignedTo, assignedToName, dueDate, status)
    VALUES (@id, @connectionId, @title, @description, @assignedTo, @assignedToName, @dueDate, @status)
  `).run(m);
  res.status(201).json(m);
});

app.put('/api/milestones/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.prepare('UPDATE milestones SET status = ? WHERE id = ?').run(status, id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`⚡ Offline SQLite Backend API running on http://localhost:${PORT}`);
  console.log(`📁 Database File Location: ${dbPath}`);
});
