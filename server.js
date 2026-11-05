const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'data.json');
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const DAY = 24 * 60 * 60 * 1000;
const uuid = () => crypto.randomUUID();
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// =====================================================================
//  Tiny JSON "database"
// =====================================================================
let db = { users: {}, groups: {}, messages: [], calls: [], statuses: [], reads: {}, sessions: {} };
if (fs.existsSync(DB_FILE)) {
  try { Object.assign(db, JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))); } catch (e) { /* start fresh */ }
}
let saveTimer = null;
function flush() { try { fs.writeFileSync(DB_FILE, JSON.stringify(db)); } catch (e) { /* ignore */ } }
function save() { clearTimeout(saveTimer); saveTimer = setTimeout(flush, 150); }

// =====================================================================
//  Demo contacts ("bots") so a single user always has people to chat with
// =====================================================================
const BOTS = [
  { key: 'ayesha', username: 'Ayesha Khan', about: 'Studying for finals 📚', color: '#e91e63',
    greet: 'Hey! 👋 Welcome to ChatApp. Did you start the assignment yet?', status: 'Library till midnight 📚',
    replies: ['Same here, I am so behind 😅', 'Want to study together tomorrow?', 'Send me your notes later please 🙏', 'Haha true 😂'] },
  { key: 'ali', username: 'Ali Raza', about: 'Hey there! I am using ChatApp.', color: '#3f51b5',
    greet: 'Salam! Are you coming to the lab tomorrow?', status: 'Match tonight 🏏',
    replies: ['Cool 👍', 'Lets meet at the cafeteria', 'Did you watch the match last night?', 'Haha okay okay 😄'] },
  { key: 'prof_sara', username: 'Prof. Sara', about: 'Office hours: Mon & Wed 2-4pm', color: '#009688',
    greet: 'Welcome! Reminder: assignment submissions close this Friday.', status: 'Reminder: submit before Friday!',
    replies: ['Please check the course portal for details.', 'Come to my office hours if you need help.', 'Good question. We will cover it in class.', 'Well done, keep it up!'] },
  { key: 'mom', username: 'Mom ❤️', about: 'Busy', color: '#ff7043',
    greet: 'Beta, have you eaten? 😊', status: 'Dinner is ready 🍲',
    replies: ['Take care of yourself ❤️', 'Call me when you are free', 'Did you sleep properly?', 'Allah hafiz, be safe 🤲'] },
];
const BOT_KEYS = BOTS.map((b) => b.key);

function botText(bot, text) {
  const t = (text || '').toLowerCase();
  if (/\b(hi|hello|hey|salam|assalam\w*)\b/.test(t)) return pick(['Hello! 😊', 'Hey! How is your day going?', 'Hi there! 👋', 'Walaikum assalam! 😊']);
  if (/how are you|kaise ho|how r u/.test(t)) return pick(["I'm good, thanks! How about you?", 'Alhamdulillah, all good 😊 you?']);
  if (/assignment|project|homework|deadline/.test(t)) return pick(['The deadline is this Friday, do not leave it for the last night!', 'I am almost done with mine 💪', 'Need any help with it?']);
  if (/exam|quiz|test|final/.test(t)) return pick(['Exams are stressing me out 😩', 'Lets make a study plan!', 'Revise the past papers, they help a lot.']);
  if (/thank|shukriya|thx/.test(t)) return pick(["You're welcome! 😊", 'Anytime! 🙌', 'No problem 👍']);
  if (/bye|good night|allah hafiz|see you/.test(t)) return pick(['Bye! Take care 👋', 'Good night 🌙', 'See you soon!']);
  if (/\?\s*$/.test(t)) return pick(['Hmm, good question 🤔 let me check and tell you.', 'Not sure, what do you think?', 'I think yes 😄']);
  return pick(bot.replies);
}

function ensureBots() {
  BOTS.forEach((b) => {
    if (!db.users[b.key]) {
      db.users[b.key] = { username: b.username, about: b.about, color: b.color, bot: true, createdAt: Date.now(), lastSeen: Date.now() };
    }
    const has = db.statuses.some((s) => s.user === b.key && Date.now() - s.time < DAY);
    if (!has) db.statuses.push({ id: uuid(), user: b.key, text: b.status, bg: b.color, time: Date.now() - Math.floor(Math.random() * 3600000) });
  });
  db.statuses = db.statuses.filter((s) => Date.now() - s.time < DAY);
  save();
}
ensureBots();

// =====================================================================
//  Helpers
// =====================================================================
const online = new Map(); // user key -> Set(socket ids)
const isOnline = (k) => !!(db.users[k] && db.users[k].bot) || online.has(k);
const isGroup = (to) => typeof to === 'string' && to.startsWith('g:');
const chatId = (a, b) => (isGroup(b) ? b : [a, b].sort().join('|'));
const COLORS = ['#e53935', '#8e24aa', '#3949ab', '#1e88e5', '#00897b', '#43a047', '#f4511e', '#6d4c41', '#00acc1', '#7cb342'];

function publicUser(k) {
  const u = db.users[k];
  if (!u) return null;
  return { key: k, username: u.username, about: u.about || '', color: u.color || '#00a884', bot: !!u.bot, online: isOnline(k), lastSeen: u.lastSeen || null };
}
const toClient = (m, viewer) => ({ ...m, starred: (m.starred || []).includes(viewer) });
const fileType = (mime) => (/^image\//.test(mime) ? 'image' : /^audio\//.test(mime) ? 'audio' : /^video\//.test(mime) ? 'video' : 'file');

function recipients(m) {
  if (isGroup(m.to)) { const g = db.groups[m.to.slice(2)]; return g ? g.members : []; }
  return [...new Set([m.from, m.to])];
}
function canAccess(me, m) { return recipients(m).includes(me); }

function cleanFile(f) {
  if (!f || typeof f.url !== 'string' || !/^\/uploads\/[a-f0-9-]+\.[a-z0-9]{1,8}$/.test(f.url)) return null;
  return { url: f.url, name: String(f.name || 'file').slice(0, 120), size: Number(f.size) || 0, mime: String(f.mime || '').slice(0, 100) };
}

let io; // set below

function addMessage({ from, to, text = '', file = null, replyTo = null, type }) {
  const m = {
    id: uuid(), chat: chatId(from, to), from, to,
    type: type || (file ? fileType(file.mime) : 'text'),
    text, file, replyTo, time: Date.now(),
    status: isGroup(to) ? 'sent' : isOnline(to) ? 'delivered' : 'sent',
    reactions: {}, starred: [],
  };
  db.messages.push(m);
  save();
  if (io) recipients(m).forEach((k) => io.to('user:' + k).emit('message', toClient(m, k)));
  return m;
}

// ---------- bots reply to the user ----------
function triggerBots(m) {
  if (m.type === 'system' || (db.users[m.from] && db.users[m.from].bot)) return;
  if (!isGroup(m.to)) {
    const bot = db.users[m.to];
    if (bot && bot.bot) botRespond(Object.assign({ key: m.to }, BOTS.find((b) => b.key === m.to)), m, m.to);
  } else {
    const g = db.groups[m.to.slice(2)];
    const bots = g ? g.members.filter((k) => BOT_KEYS.includes(k)) : [];
    if (bots.length && Math.random() < 0.8) {
      const key = pick(bots);
      botRespond(Object.assign({ key }, BOTS.find((b) => b.key === key)), m, m.to);
    }
  }
}
function botRespond(bot, m, chatKey) {
  const user = m.from, group = isGroup(chatKey), typingChat = group ? chatKey : bot.key;
  setTimeout(() => {
    if (!group) { m.status = 'read'; save(); io.to('user:' + user).emit('status', { ids: [m.id], status: 'read' }); }
  }, 700);
  setTimeout(() => io.to('user:' + user).emit('typing', { from: bot.key, chat: typingChat, typing: true }), 1000);
  setTimeout(() => {
    io.to('user:' + user).emit('typing', { from: bot.key, chat: typingChat, typing: false });
    const text = m.file && !m.text ? pick(['Got it, thanks! 👍', 'Nice one! 😄', 'Received ✅']) : botText(bot, m.text);
    addMessage({ from: bot.key, to: group ? chatKey : user, text });
  }, 2200 + Math.floor(Math.random() * 1200));
}

// ---------- first-run content for a new user ----------
function seedUser(key) {
  const now = Date.now();
  BOTS.forEach((b, i) => {
    db.messages.push({ id: uuid(), chat: chatId(b.key, key), from: b.key, to: key, type: 'text', text: b.greet, file: null, replyTo: null,
      time: now - (BOTS.length - i) * 60000, status: 'delivered', reactions: {}, starred: [] });
  });
  const gid = crypto.randomBytes(6).toString('hex');
  db.groups[gid] = { id: gid, name: 'CS-101 Class Group 🎓', members: [key, 'ayesha', 'ali', 'prof_sara'], admin: 'prof_sara', createdAt: now - 3600000 };
  const gk = 'g:' + gid;
  [['prof_sara', 'system', 'Prof. Sara created group "CS-101 Class Group 🎓"'],
   ['prof_sara', 'text', 'Welcome everyone! Post your questions about the assignment here.'],
   ['ali', 'text', 'Is the deadline Friday or Saturday?'],
   ['prof_sara', 'text', 'Friday 11:59pm. No extensions!'],
   ['ayesha', 'text', 'Good luck everyone 💪']].forEach(([from, type, text], i) => {
    db.messages.push({ id: uuid(), chat: gk, from, to: gk, type, text, file: null, replyTo: null, time: now - (6 - i) * 45000, status: 'sent', reactions: {}, starred: [] });
  });
}

// =====================================================================
//  Auth
// =====================================================================
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  return { salt, hash: crypto.scryptSync(password, salt, 64).toString('hex') };
}
function verifyPassword(password, user) {
  if (!user || !user.hash) return false;
  const { hash } = hashPassword(password, user.salt);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(user.hash, 'hex'));
}
function newSession(key) {
  const token = crypto.randomBytes(24).toString('hex');
  db.sessions[token] = key;
  save();
  return token;
}

// =====================================================================
//  Express
// =====================================================================
const app = express();
const server = http.createServer(app);
io = new Server(server, { maxHttpBufferSize: 1e6 });

app.use(express.json({ limit: '16mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOAD_DIR, {
  setHeaders: (res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', 'sandbox');
  },
}));

const validName = (s) => typeof s === 'string' && /^[a-zA-Z0-9_]{3,20}$/.test(s);

app.post('/api/register', (req, res) => {
  const { username, password } = req.body || {};
  if (!validName(username)) return res.status(400).json({ error: 'Username: 3-20 letters, numbers or underscore' });
  if (typeof password !== 'string' || password.length < 4) return res.status(400).json({ error: 'Password must be at least 4 characters' });
  const key = username.toLowerCase();
  if (db.users[key]) return res.status(409).json({ error: 'Username already taken' });
  const { salt, hash } = hashPassword(password);
  db.users[key] = { username, salt, hash, about: 'Hey there! I am using ChatApp.', color: pick(COLORS), createdAt: Date.now(), lastSeen: Date.now() };
  seedUser(key);
  save();
  res.json({ token: newSession(key), user: publicUser(key) });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  const key = String(username || '').toLowerCase();
  const user = db.users[key];
  if (!user || typeof password !== 'string' || !verifyPassword(password, user)) return res.status(401).json({ error: 'Wrong username or password' });
  res.json({ token: newSession(key), user: publicUser(key) });
});

function authHttp(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  const me = db.sessions[token];
  if (!me || !db.users[me]) return res.status(401).json({ error: 'Not logged in' });
  req.me = me;
  next();
}

app.get('/api/me', authHttp, (req, res) => res.json(publicUser(req.me)));

app.put('/api/me', authHttp, (req, res) => {
  const about = String((req.body || {}).about || '').trim().slice(0, 140);
  db.users[req.me].about = about;
  save();
  res.json(publicUser(req.me));
});

app.get('/api/contacts', authHttp, (req, res) => {
  res.json(Object.keys(db.users).filter((k) => k !== req.me).map(publicUser).sort((a, b) => a.username.localeCompare(b.username)));
});

app.get('/api/chats', authHttp, (req, res) => {
  const me = req.me;
  const byChat = new Map();
  db.messages.forEach((m) => { if (!byChat.has(m.chat)) byChat.set(m.chat, []); byChat.get(m.chat).push(m); });
  const build = (key, base) => {
    const id = chatId(me, key);
    const msgs = byChat.get(id) || [];
    const last = msgs[msgs.length - 1] || null;
    const readT = (db.reads[me] || {})[id] || 0;
    const unread = msgs.filter((m) => m.from !== me && m.time > readT && m.type !== 'system' && !m.deleted).length;
    return { ...base, key, last: last ? toClient(last, me) : null, unread };
  };
  const items = [];
  Object.values(db.groups).filter((g) => g.members.includes(me)).forEach((g) => {
    items.push(build('g:' + g.id, { group: true, name: g.name, members: g.members, admin: g.admin }));
  });
  Object.keys(db.users).filter((k) => k !== me && byChat.has(chatId(me, k))).forEach((k) => items.push(build(k, publicUser(k))));
  items.sort((a, b) => (b.last ? b.last.time : 0) - (a.last ? a.last.time : 0));
  res.json(items);
});

app.get('/api/messages/:chat', authHttp, (req, res) => {
  const me = req.me;
  const other = req.params.chat;
  if (isGroup(other)) {
    const g = db.groups[other.slice(2)];
    if (!g || !g.members.includes(me)) return res.status(404).json({ error: 'No such chat' });
  } else if (!db.users[other.toLowerCase()]) return res.status(404).json({ error: 'No such chat' });
  const id = chatId(me, isGroup(other) ? other : other.toLowerCase());
  res.json(db.messages.filter((m) => m.chat === id).map((m) => toClient(m, me)));
});

app.post('/api/upload', authHttp, (req, res) => {
  const { name, mime, data } = req.body || {};
  if (typeof data !== 'string' || typeof name !== 'string') return res.status(400).json({ error: 'Bad upload' });
  const buf = Buffer.from(data, 'base64');
  if (!buf.length || buf.length > 10 * 1024 * 1024) return res.status(400).json({ error: 'File must be under 10 MB' });
  const ext = (path.extname(name).slice(1).toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin').slice(0, 8);
  const file = uuid() + '.' + ext;
  fs.writeFileSync(path.join(UPLOAD_DIR, file), buf);
  res.json({ url: '/uploads/' + file, name: name.slice(0, 120), size: buf.length, mime: String(mime || 'application/octet-stream').slice(0, 100) });
});

app.post('/api/groups', authHttp, (req, res) => {
  const me = req.me;
  const name = String((req.body || {}).name || '').trim().slice(0, 40);
  const members = [...new Set([me, ...(Array.isArray((req.body || {}).members) ? req.body.members : []).map((k) => String(k).toLowerCase()).filter((k) => db.users[k])])];
  if (!name) return res.status(400).json({ error: 'Group name is required' });
  if (members.length < 2) return res.status(400).json({ error: 'Pick at least one member' });
  const id = crypto.randomBytes(6).toString('hex');
  db.groups[id] = { id, name, members, admin: me, createdAt: Date.now() };
  addMessage({ from: me, to: 'g:' + id, type: 'system', text: `${db.users[me].username} created group "${name}"` });
  members.forEach((k) => io.to('user:' + k).emit('chats-changed'));
  res.json({ key: 'g:' + id });
});

app.get('/api/calls', authHttp, (req, res) => {
  const me = req.me;
  res.json(db.calls.filter((c) => c.from === me || c.to === me).slice(-100).reverse().map((c) => ({
    id: c.id, peer: c.from === me ? c.to : c.from, direction: c.from === me ? 'out' : 'in',
    video: c.video, time: c.time, duration: c.duration || 0, status: c.status,
  })));
});

app.get('/api/statuses', authHttp, (req, res) => {
  const me = req.me;
  const map = new Map();
  db.statuses.filter((s) => Date.now() - s.time < DAY && db.users[s.user]).forEach((s) => {
    if (!map.has(s.user)) map.set(s.user, []);
    map.get(s.user).push({ id: s.id, text: s.text, bg: s.bg, time: s.time });
  });
  const list = [...map.entries()].map(([k, items]) => ({ user: publicUser(k), items: items.sort((a, b) => a.time - b.time), mine: k === me }));
  list.sort((a, b) => (b.mine - a.mine) || (b.items[b.items.length - 1].time - a.items[a.items.length - 1].time));
  res.json(list);
});

app.post('/api/statuses', authHttp, (req, res) => {
  const text = String((req.body || {}).text || '').trim().slice(0, 500);
  const bg = /^#[0-9a-f]{6}$/i.test((req.body || {}).bg || '') ? req.body.bg : '#00a884';
  if (!text) return res.status(400).json({ error: 'Write something first' });
  db.statuses.push({ id: uuid(), user: req.me, text, bg, time: Date.now() });
  save();
  res.json({ ok: true });
});

// =====================================================================
//  Socket.IO
// =====================================================================
const activeCalls = new Map(); // callId -> { log, timer }

function finishCall(callId, endedBy) {
  const entry = activeCalls.get(callId);
  if (!entry) return null;
  clearTimeout(entry.timer);
  const { log } = entry;
  if (log.answeredAt) log.duration = Math.max(0, Math.round((Date.now() - log.answeredAt) / 1000));
  delete log.answeredAt;
  activeCalls.delete(callId);
  save();
  const other = log.from === endedBy ? log.to : log.from;
  return other;
}

io.use((socket, next) => {
  const me = db.sessions[socket.handshake.auth && socket.handshake.auth.token];
  if (!me || !db.users[me]) return next(new Error('unauthorized'));
  socket.me = me;
  next();
});

io.on('connection', (socket) => {
  const me = socket.me;
  if (!online.has(me)) online.set(me, new Set());
  online.get(me).add(socket.id);
  socket.join('user:' + me);
  io.emit('presence', { user: me, online: true, lastSeen: null });

  // everything sent to me while I was offline is now delivered
  const delivered = {};
  db.messages.forEach((m) => {
    if (m.to === me && m.status === 'sent' && !isGroup(m.to)) {
      m.status = 'delivered';
      (delivered[m.from] = delivered[m.from] || []).push(m.id);
    }
  });
  Object.entries(delivered).forEach(([from, ids]) => io.to('user:' + from).emit('status', { ids, status: 'delivered' }));
  save();

  // ---------- messaging ----------
  socket.on('message', (p, ack) => {
    ack = typeof ack === 'function' ? ack : () => {};
    p = p || {};
    const raw = String(p.to || '');
    const to = isGroup(raw) ? raw : raw.toLowerCase();
    if (isGroup(to)) {
      const g = db.groups[to.slice(2)];
      if (!g || !g.members.includes(me)) return ack({ error: 'Invalid chat' });
    } else if (!db.users[to] || to === me) return ack({ error: 'Invalid chat' });
    const text = String(p.text || '').trim().slice(0, 4000);
    const file = cleanFile(p.file);
    if (!text && !file) return ack({ error: 'Empty message' });
    let replyTo = null;
    if (p.replyTo) {
      const r = db.messages.find((x) => x.id === p.replyTo && x.chat === chatId(me, to));
      if (r) replyTo = { id: r.id, from: r.from, type: r.type, deleted: !!r.deleted, text: r.deleted ? '' : (r.text || (r.file ? r.file.name : '')).slice(0, 100) };
    }
    const m = addMessage({ from: me, to, text, file, replyTo });
    ack({ ok: true, id: m.id });
    triggerBots(m);
  });

  socket.on('read', (p) => {
    const raw = String((p && p.chat) || '');
    const other = isGroup(raw) ? raw : raw.toLowerCase();
    if (isGroup(other)) {
      const g = db.groups[other.slice(2)];
      if (!g || !g.members.includes(me)) return;
    } else if (!db.users[other]) return;
    (db.reads[me] = db.reads[me] || {})[chatId(me, other)] = Date.now();
    if (!isGroup(other)) {
      const ids = [];
      db.messages.forEach((m) => { if (m.from === other && m.to === me && m.status !== 'read') { m.status = 'read'; ids.push(m.id); } });
      if (ids.length) io.to('user:' + other).emit('status', { ids, status: 'read' });
    }
    save();
  });

  socket.on('typing', (p) => {
    p = p || {};
    const raw = String(p.to || '');
    const to = isGroup(raw) ? raw : raw.toLowerCase();
    if (isGroup(to)) {
      const g = db.groups[to.slice(2)];
      if (!g || !g.members.includes(me)) return;
      g.members.filter((k) => k !== me).forEach((k) => io.to('user:' + k).emit('typing', { from: me, chat: to, typing: !!p.typing }));
    } else if (db.users[to]) {
      io.to('user:' + to).emit('typing', { from: me, chat: me, typing: !!p.typing });
    }
  });

  socket.on('delete', (p, ack) => {
    ack = typeof ack === 'function' ? ack : () => {};
    const m = db.messages.find((x) => x.id === (p && p.id));
    if (!m || m.from !== me) return ack({ error: 'Not allowed' });
    m.deleted = true; m.text = ''; m.file = null; m.reactions = {};
    save();
    recipients(m).forEach((k) => io.to('user:' + k).emit('deleted', { id: m.id }));
    ack({ ok: true });
  });

  socket.on('react', (p) => {
    const m = db.messages.find((x) => x.id === (p && p.id));
    if (!m || !canAccess(me, m) || m.deleted || m.type === 'system') return;
    const emoji = String((p && p.emoji) || '').slice(0, 8);
    if (!emoji || m.reactions[me] === emoji) delete m.reactions[me]; else m.reactions[me] = emoji;
    save();
    recipients(m).forEach((k) => io.to('user:' + k).emit('reaction', { id: m.id, reactions: m.reactions }));
  });

  socket.on('star', (p, ack) => {
    ack = typeof ack === 'function' ? ack : () => {};
    const m = db.messages.find((x) => x.id === (p && p.id));
    if (!m || !canAccess(me, m)) return ack({ error: 'Not allowed' });
    m.starred = m.starred || [];
    const i = m.starred.indexOf(me);
    if (i >= 0) m.starred.splice(i, 1); else m.starred.push(me);
    save();
    ack({ ok: true, starred: m.starred.includes(me) });
  });

  // ---------- calls (WebRTC signalling) ----------
  socket.on('call:invite', (p) => {
    p = p || {};
    const to = String(p.to || '').toLowerCase();
    const target = db.users[to];
    const callId = String(p.callId || uuid()).slice(0, 60);
    if (!target || to === me || activeCalls.has(callId)) return socket.emit('call:unavailable', { callId, reason: 'invalid' });
    const log = { id: callId, from: me, to, video: !!p.video, time: Date.now(), duration: 0, status: 'missed' };
    db.calls.push(log);
    const entry = { log, timer: null };
    activeCalls.set(callId, entry);
    save();

    if (target.bot) { // simulated: the contact picks up after 2 seconds
      entry.timer = setTimeout(() => {
        if (!activeCalls.has(callId)) return;
        log.status = 'answered'; log.answeredAt = Date.now();
        io.to('user:' + me).emit('call:answered', { callId, sim: true });
      }, 2000);
      return;
    }
    if (!online.has(to)) {
      activeCalls.delete(callId);
      return socket.emit('call:unavailable', { callId, reason: 'offline' });
    }
    io.to('user:' + to).emit('call:incoming', { callId, from: me, video: log.video, offer: p.offer });
    entry.timer = setTimeout(() => { // nobody picked up
      if (!activeCalls.has(callId) || log.status === 'answered') return;
      activeCalls.delete(callId);
      save();
      io.to('user:' + me).emit('call:unavailable', { callId, reason: 'noanswer' });
      io.to('user:' + to).emit('call:ended', { callId });
    }, 45000);
  });

  socket.on('call:answer', (p) => {
    const entry = activeCalls.get(p && p.callId);
    if (!entry || entry.log.to !== me || entry.log.status === 'answered') return;
    clearTimeout(entry.timer);
    entry.log.status = 'answered';
    entry.log.answeredAt = Date.now();
    socket.to('user:' + me).emit('call:handled', { callId: p.callId }); // stop ringing my other tabs
    io.to('user:' + entry.log.from).emit('call:answered', { callId: p.callId, answer: p.answer });
    save();
  });

  socket.on('call:reject', (p) => {
    const entry = activeCalls.get(p && p.callId);
    if (!entry || entry.log.to !== me) return;
    entry.log.status = 'declined';
    const other = finishCall(p.callId, me);
    socket.to('user:' + me).emit('call:handled', { callId: p.callId });
    if (other) io.to('user:' + other).emit('call:rejected', { callId: p.callId });
  });

  socket.on('call:ice', (p) => {
    const entry = activeCalls.get(p && p.callId);
    if (!entry || (entry.log.from !== me && entry.log.to !== me)) return;
    const other = entry.log.from === me ? entry.log.to : entry.log.from;
    io.to('user:' + other).emit('call:ice', { callId: p.callId, candidate: p.candidate });
  });

  socket.on('call:end', (p) => {
    const entry = activeCalls.get(p && p.callId);
    if (!entry || (entry.log.from !== me && entry.log.to !== me)) return;
    const other = finishCall(p.callId, me);
    if (other) io.to('user:' + other).emit('call:ended', { callId: p.callId });
  });

  socket.on('disconnect', () => {
    const set = online.get(me);
    if (set) {
      set.delete(socket.id);
      if (set.size === 0) {
        online.delete(me);
        db.users[me].lastSeen = Date.now();
        save();
        io.emit('presence', { user: me, online: false, lastSeen: db.users[me].lastSeen });
        activeCalls.forEach((entry, callId) => { // hang up any call this user was in
          if (entry.log.from === me || entry.log.to === me) {
            const other = finishCall(callId, me);
            if (other) io.to('user:' + other).emit('call:ended', { callId });
          }
        });
      }
    }
  });
});

if (require.main === module) {
  server.listen(PORT, () => console.log(`ChatApp running on http://localhost:${PORT}`));
  const bye = () => { flush(); process.exit(0); };
  process.on('SIGINT', bye);
  process.on('SIGTERM', bye);
}
module.exports = { server, db, flush };
