(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ===================================================================
  //  Icons
  // ===================================================================
  const P = (d) => `<path d="${d}"/>`;
  const ICONS = {
    chat: P('M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z'),
    phone: P('M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'),
    video: P('M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z'),
    search: P('M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'),
    send: P('M2 21l21-9L2 3v7l15 2-15 2z'),
    more: P('M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'),
    mic: P('M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z'),
    attach: P('M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 015 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 005 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z'),
    emoji: P('M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-10c.83 0 1.5-.67 1.5-1.5S16.33 7 15.5 7 14 7.67 14 8.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 7 8.5 7 7 7.67 7 8.5 7.67 10 8.5 10zm3.5 7.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z'),
    back: P('M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'),
    close: P('M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'),
    plus: P('M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'),
    check: P('M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'),
    checks: P('M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z'),
    trash: P('M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z'),
    star: P('M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'),
    reply: P('M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z'),
    doc: P('M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z'),
    image: P('M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'),
    copy: P('M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z'),
    group: P('M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z'),
    logout: P('M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z'),
    user: P('M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'),
    status: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4.2 2.6"/><circle cx="12" cy="12" r="3.2"/>',
    arrow: P('M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z'),
    chev: P('M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z'),
  };
  const icon = (n, cls = '') => `<svg viewBox="0 0 24 24" class="ic ${cls}" aria-hidden="true">${ICONS[n] || ''}</svg>`;
  const hydrate = (root = document) => $$('i[data-icon]', root).forEach((i) => { i.outerHTML = icon(i.dataset.icon, i.className); });

  // ===================================================================
  //  State & helpers
  // ===================================================================
  const S = {
    token: localStorage.getItem('token'), me: null, tab: 'chats', filter: 'all',
    chats: [], users: {}, calls: [], statuses: [], current: null, messages: [], replyTo: null, typing: {},
  };
  let socket = null;

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const isGroup = (k) => typeof k === 'string' && k.startsWith('g:');
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));
  const userName = (k) => (k === (S.me && S.me.key) ? 'You' : (S.users[k] && S.users[k].username) || k);
  const hm = (t) => new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const sameDay = (a, b) => a.toDateString() === b.toDateString();
  const dayLabel = (t) => {
    const d = new Date(t), n = new Date(), y = new Date(); y.setDate(n.getDate() - 1);
    return sameDay(d, n) ? 'Today' : sameDay(d, y) ? 'Yesterday' : d.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' });
  };
  const listTime = (t) => {
    const d = new Date(t), n = new Date(), y = new Date(); y.setDate(n.getDate() - 1);
    return sameDay(d, n) ? hm(t) : sameDay(d, y) ? 'Yesterday' : d.toLocaleDateString([], { day: 'numeric', month: 'numeric', year: '2-digit' });
  };
  const lastSeen = (u) => {
    if (!u) return '';
    if (u.online) return 'online';
    if (!u.lastSeen) return 'offline';
    const d = new Date(u.lastSeen), n = new Date(), y = new Date(); y.setDate(n.getDate() - 1);
    return sameDay(d, n) ? `last seen today at ${hm(u.lastSeen)}` : sameDay(d, y) ? `last seen yesterday at ${hm(u.lastSeen)}` : `last seen ${d.toLocaleDateString()}`;
  };
  const fmtSize = (b) => (b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB');
  const fmtDur = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const linkify = (t) => esc(t).replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  const firstChar = (n) => (Array.from(String(n || '?'))[0] || '?');

  function avatar(ent, cls = '') {
    if (!ent) return `<div class="avatar ${cls}" style="background:#999">?</div>`;
    if (ent.group) return `<div class="avatar ${cls}" style="background:#6b7c85">${icon('group')}</div>`;
    return `<div class="avatar ${cls}" style="background:${esc(ent.color || '#00a884')}">${esc(firstChar(ent.username))}</div>`;
  }
  function entityOf(key) {
    if (isGroup(key)) return S.chats.find((c) => c.key === key) || { group: true, name: 'Group', key, members: [] };
    return S.users[key] || { key, username: key };
  }
  const nameOf = (ent) => (ent.group ? ent.name : ent.username);

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.add('hidden'), 3200);
  }

  async function api(path, opts = {}) {
    const res = await fetch(path, {
      ...opts,
      headers: { 'Content-Type': 'application/json', ...(S.token ? { Authorization: 'Bearer ' + S.token } : {}) },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401 && S.token && !path.startsWith('/api/login')) logout();
    if (!res.ok) throw new Error(data.error || 'Something went wrong');
    return data;
  }

  // ---------- small sounds (no files needed) ----------
  let actx;
  const ac = () => (actx = actx || new (window.AudioContext || window.webkitAudioContext)());
  function beep(freq = 880, dur = 0.12, vol = 0.08) {
    try {
      const c = ac(), o = c.createOscillator(), g = c.createGain();
      o.frequency.value = freq; g.gain.value = vol;
      o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + dur);
    } catch (e) { /* audio not available */ }
  }
  let ringTimer = null;
  const startRing = () => { stopRing(); const r = () => { beep(520, 0.35, 0.1); setTimeout(() => beep(440, 0.35, 0.1), 420); }; r(); ringTimer = setInterval(r, 2200); };
  const stopRing = () => { clearInterval(ringTimer); ringTimer = null; };

  // ---------- modal & popup ----------
  function openModal(html, cls = '') {
    $('#modalCard').className = 'modal-card ' + cls;
    $('#modalCard').innerHTML = html;
    hydrate($('#modalCard'));
    $('#modal').classList.remove('hidden');
    return $('#modalCard');
  }
  const closeModal = () => { $('#modal').classList.add('hidden'); $('#modalCard').innerHTML = ''; clearTimeout(storyTimer); };
  $('#modal').addEventListener('mousedown', (e) => { if (e.target.id === 'modal') closeModal(); });
  const modalHead = (title) => `<div class="modal-head"><button class="icon-btn" data-close><i data-icon="close"></i></button><h3>${esc(title)}</h3></div>`;

  function showPopup(anchor, html) {
    const p = $('#popup');
    p.innerHTML = html; hydrate(p); p.classList.remove('hidden');
    const r = anchor.getBoundingClientRect();
    p.style.left = '0px'; p.style.top = '0px';
    const w = p.offsetWidth, h = p.offsetHeight;
    p.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, r.right - w)) + 'px';
    p.style.top = Math.max(8, Math.min(window.innerHeight - h - 8, r.bottom + 4)) + 'px';
  }
  const hidePopup = () => $('#popup').classList.add('hidden');
  document.addEventListener('mousedown', (e) => { if (!e.target.closest('#popup') && !e.target.closest('[data-popup-owner]')) hidePopup(); });
  document.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });

  // ===================================================================
  //  Auth
  // ===================================================================
  async function auth(kind) {
    $('#authError').textContent = '';
    try {
      const data = await api('/api/' + kind, { method: 'POST', body: { username: $('#username').value.trim(), password: $('#password').value } });
      S.token = data.token;
      localStorage.setItem('token', S.token);
      start();
    } catch (e) { $('#authError').textContent = e.message; }
  }
  $('#authForm').addEventListener('submit', (e) => { e.preventDefault(); auth('login'); });
  $('#registerBtn').addEventListener('click', () => auth('register'));

  function logout() {
    localStorage.removeItem('token');
    S.token = null; S.me = null; S.current = null; S.chats = []; S.messages = [];
    if (socket) { socket.disconnect(); socket = null; }
    if (call) endCall(true);
    $('#app').classList.add('hidden');
    $('#auth').classList.remove('hidden');
    document.title = 'ChatApp';
    closeModal(); hidePopup();
  }

  // ===================================================================
  //  Data loading
  // ===================================================================
  async function loadContacts() {
    const list = await api('/api/contacts');
    list.forEach((u) => { S.users[u.key] = u; });
    if (S.me) S.users[S.me.key] = { ...S.users[S.me.key], ...S.me };
  }
  async function refreshChats() {
    const [chats] = await Promise.all([api('/api/chats')]);
    if (chats.some((c) => !c.group && !S.users[c.key])) await loadContacts();
    chats.forEach((c) => { if (!c.group) S.users[c.key] = { ...S.users[c.key], ...c }; });
    S.chats = chats;
    updateBadges();
  }
  async function loadCalls() { S.calls = await api('/api/calls'); }
  async function loadStatuses() { S.statuses = await api('/api/statuses'); }

  async function start() {
    try {
      S.me = await api('/api/me');
      S.users[S.me.key] = S.me;
      await loadContacts();
    } catch (e) { return; }
    $('#auth').classList.add('hidden');
    $('#app').classList.remove('hidden');
    $('#meAvatar').outerHTML = avatar(S.me, 'sm').replace('class="avatar sm"', 'class="avatar sm" id="meAvatar"');
    connectSocket();
    await refreshChats();
    renderSide();
  }

  function updateBadges() {
    const n = S.chats.reduce((a, c) => a + (c.unread || 0), 0);
    const b = $('#railBadge');
    b.textContent = n > 99 ? '99+' : n; b.classList.toggle('hidden', !n);
    document.title = (n ? `(${n}) ` : '') + 'ChatApp';
  }

  // ===================================================================
  //  Side panel (chats / calls / status)
  // ===================================================================
  function renderSide() {
    const tab = S.tab;
    $('#sideTitle').textContent = { chats: 'Chats', calls: 'Calls', status: 'Status' }[tab];
    $('#filters').classList.toggle('hidden', tab !== 'chats');
    $('#search').placeholder = tab === 'chats' ? 'Search or start a new chat' : tab === 'calls' ? 'Search calls' : 'Search status';
    $$('.rail-btn[data-tab]').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
    $('#newChatBtn').title = tab === 'calls' ? 'New call' : tab === 'status' ? 'Add status' : 'New chat';
    if (tab === 'chats') renderChatList(); else if (tab === 'calls') renderCalls(); else renderStatus();
    hydrate($('#side'));
  }

  function previewText(m) {
    if (!m) return '';
    if (m.deleted) return '🚫 This message was deleted';
    switch (m.type) {
      case 'image': return '📷 Photo';
      case 'video': return '🎥 Video';
      case 'audio': return '🎤 Voice message';
      case 'file': return '📄 ' + (m.file ? m.file.name : 'File');
      default: return m.text;
    }
  }
  const tickIcon = (status) => (status === 'sent' ? icon('check') : icon('checks', status === 'read' ? 'read' : ''));

  function chatRow(c) {
    const ent = entityOf(c.key);
    const last = c.last;
    const typing = S.typing[c.key];
    let prev = '';
    if (typing) prev = `<span class="typing">${isGroup(c.key) ? esc(typing.name) + ' is ' : ''}typing…</span>`;
    else if (last) {
      const mine = last.from === S.me.key;
      const who = isGroup(c.key) && last.type !== 'system' ? (mine ? 'You: ' : esc(userName(last.from).split(' ')[0]) + ': ') : '';
      prev = (mine && !isGroup(c.key) && !last.deleted ? `<span style="display:inline-flex;color:${last.status === 'read' ? 'var(--tick)' : 'inherit'}">${tickIcon(last.status)}</span>` : '') + `<span style="overflow:hidden;text-overflow:ellipsis">${who}${esc(previewText(last))}</span>`;
    }
    return `<div class="row ${c.key === S.current ? 'active' : ''}" data-chat="${esc(c.key)}">
      <div style="position:relative">${avatar(ent)}${!isGroup(c.key) && ent.online ? '<span class="online-dot"></span>' : ''}</div>
      <div class="meta">
        <div class="line"><span class="name">${esc(nameOf(ent))}</span><span class="time ${c.unread ? 'unread' : ''}">${last ? listTime(last.time) : ''}</span></div>
        <div class="line"><span class="preview">${prev}</span>${c.unread ? `<span class="badge">${c.unread}</span>` : ''}</div>
      </div></div>`;
  }

  function renderChatList() {
    const q = $('#search').value.trim().toLowerCase();
    let list = S.chats.filter((c) => nameOf(entityOf(c.key)).toLowerCase().includes(q));
    if (S.filter === 'unread') list = list.filter((c) => c.unread);
    if (S.filter === 'groups') list = list.filter((c) => isGroup(c.key));
    let html = list.map(chatRow).join('');
    if (q) {
      const others = Object.values(S.users).filter((u) => u.key !== S.me.key && u.username.toLowerCase().includes(q) && !S.chats.some((c) => c.key === u.key));
      if (others.length) html += '<div class="section-title">Contacts on ChatApp</div>' + others.map((u) => `<div class="row" data-chat="${esc(u.key)}">${avatar(u)}<div class="meta"><div class="line"><span class="name">${esc(u.username)}</span></div><div class="line"><span class="preview">${esc(u.about || '')}</span></div></div></div>`).join('');
    }
    $('#sideBody').innerHTML = html || `<div class="nothing">${S.filter === 'unread' ? 'No unread chats' : S.filter === 'groups' ? 'No groups yet' : 'No chats found'}</div>`;
  }

  function renderCalls() {
    const q = $('#search').value.trim().toLowerCase();
    const list = S.calls.filter((c) => userName(c.peer).toLowerCase().includes(q));
    $('#sideBody').innerHTML = list.length ? list.map((c) => {
      const u = entityOf(c.peer);
      const missed = c.status !== 'answered';
      const incoming = c.direction === 'in';
      const label = c.status === 'answered' ? (c.duration ? fmtDur(c.duration) : 'Answered') : c.status === 'declined' ? (incoming ? 'Declined' : 'Declined') : incoming ? 'Missed' : 'No answer';
      return `<div class="row" data-call-row="${esc(c.id)}">
        ${avatar(u)}
        <div class="meta"><div class="line"><span class="name ${missed && incoming ? 'miss' : ''}">${esc(u.username)}</span>
          <span class="actions"><button class="icon-btn" data-call="${esc(c.peer)}" data-video="0" title="Voice call">${icon('phone')}</button><button class="icon-btn" data-call="${esc(c.peer)}" data-video="1" title="Video call">${icon('video')}</button></span></div>
        <div class="line"><span class="preview"><span class="${missed ? (incoming ? 'dir-miss' : '') : 'dir-in'}" style="display:inline-flex;transform:${incoming ? 'rotate(180deg)' : 'none'}">${icon('arrow')}</span>${c.video ? 'Video' : 'Voice'} · ${esc(label)} · ${listTime(c.time)}</span></div></div></div>`;
    }).join('') : '<div class="nothing">No calls yet.<br>Open a chat and tap the phone or video icon.</div>';
  }

  function renderStatus() {
    const q = $('#search').value.trim().toLowerCase();
    const mine = S.statuses.find((s) => s.mine);
    let html = `<div class="row" data-status-add>
      <div style="position:relative">${avatar(S.me, mine ? 'ring' : '')}<span class="online-dot" style="background:var(--accent);display:flex;align-items:center;justify-content:center;color:#fff;width:18px;height:18px;right:-2px;bottom:-2px">${icon('plus')}</span></div>
      <div class="meta"><div class="line"><span class="name">My status</span></div><div class="line"><span class="preview">${mine ? 'Tap to view · ' + listTime(mine.items[mine.items.length - 1].time) : 'Tap to add status update'}</span></div></div></div>`;
    const others = S.statuses.filter((s) => !s.mine && s.user.username.toLowerCase().includes(q));
    if (others.length) html += '<div class="section-title">Recent updates</div>' + others.map((s) => `<div class="row" data-status="${esc(s.user.key)}">${avatar(s.user, 'ring')}<div class="meta"><div class="line"><span class="name">${esc(s.user.username)}</span></div><div class="line"><span class="preview">${listTime(s.items[s.items.length - 1].time)}</span></div></div></div>`).join('');
    $('#sideBody').innerHTML = html;
  }

  // ---------- side events ----------
  $('#search').addEventListener('input', renderSide);
  $$('.chip').forEach((c) => c.addEventListener('click', () => {
    S.filter = c.dataset.f;
    $$('.chip').forEach((x) => x.classList.toggle('active', x === c));
    renderSide();
  }));
  $$('.rail-btn[data-tab]').forEach((b) => b.addEventListener('click', async () => {
    S.tab = b.dataset.tab; $('#search').value = '';
    if (S.tab === 'calls') await loadCalls().catch(() => {});
    if (S.tab === 'status') await loadStatuses().catch(() => {});
    renderSide();
  }));
  $('#sideBody').addEventListener('click', (e) => {
    const callBtn = e.target.closest('[data-call]');
    if (callBtn) return startCall(callBtn.dataset.call, callBtn.dataset.video === '1');
    const row = e.target.closest('[data-chat]');
    if (row) return openChat(row.dataset.chat);
    if (e.target.closest('[data-status-add]')) {
      const mine = S.statuses.find((s) => s.mine);
      return mine ? viewStatus(mine) : composeStatus();
    }
    const st = e.target.closest('[data-status]');
    if (st) viewStatus(S.statuses.find((s) => s.user.key === st.dataset.status));
  });
  $('#newChatBtn').addEventListener('click', () => (S.tab === 'status' ? composeStatus() : newChatModal(S.tab === 'calls')));
  $('#menuBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    showPopup($('#menuBtn'), `<button data-m="group">${icon('group')}New group</button><button data-m="profile">${icon('user')}Profile</button><button data-m="logout">${icon('logout')}Log out</button>`);
  });
  $('#popup').addEventListener('click', (e) => {
    const b = e.target.closest('[data-m]');
    if (!b) return;
    hidePopup();
    if (b.dataset.m === 'group') newGroupModal();
    if (b.dataset.m === 'profile') profileModal();
    if (b.dataset.m === 'logout') logout();
  });
  $('#profileBtn').addEventListener('click', profileModal);
  $('#themeBtn').addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme !== 'dark';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    $('#themeBtn').textContent = dark ? '☀️' : '🌙';
  });
  if (localStorage.getItem('theme') === 'dark') { document.documentElement.dataset.theme = 'dark'; $('#themeBtn').textContent = '☀️'; }

  // ===================================================================
  //  Modals: new chat / group / profile / info
  // ===================================================================
  function contactRows(users, attr) {
    return users.map((u) => `<div class="row" ${attr}="${esc(u.key)}">${avatar(u)}<div class="meta"><div class="line"><span class="name">${esc(u.username)}</span></div><div class="line"><span class="preview">${esc(u.about || '')}</span></div></div></div>`).join('');
  }
  const allContacts = () => Object.values(S.users).filter((u) => u.key !== S.me.key).sort((a, b) => a.username.localeCompare(b.username));

  function newChatModal(forCall) {
    const card = openModal(modalHead(forCall ? 'New call' : 'New chat') + `<div class="modal-body flush">
      ${forCall ? '' : `<div class="row" data-new-group><div class="avatar" style="background:var(--accent)">${icon('group')}</div><div class="meta"><div class="line"><span class="name">New group</span></div></div></div>`}
      <div class="section-title">Contacts on ChatApp</div>
      <div style="overflow-y:auto;max-height:55vh">${contactRows(allContacts(), forCall ? 'data-pick-call' : 'data-pick')}</div></div>`);
    card.onclick = (e) => {
      if (e.target.closest('[data-new-group]')) return newGroupModal();
      const p = e.target.closest('[data-pick]');
      if (p) { closeModal(); openChat(p.dataset.pick); }
      const c = e.target.closest('[data-pick-call]');
      if (c) { closeModal(); startCall(c.dataset.pickCall, false); }
    };
  }

  function newGroupModal() {
    const card = openModal(modalHead('New group') + `<div class="modal-body">
      <input class="field" id="gName" type="text" placeholder="Group name" maxlength="40">
      <div class="muted">Add members</div>
      <div style="max-height:40vh;overflow-y:auto;margin:0 -16px">
        ${allContacts().map((u) => `<label class="row" style="cursor:pointer">${avatar(u, 'md')}<div class="meta"><div class="line"><span class="name" style="font-size:15px">${esc(u.username)}</span><input type="checkbox" class="check" value="${esc(u.key)}"></div></div></label>`).join('')}
      </div>
      <div class="error" id="gErr"></div>
      <button class="btn primary" id="gCreate">Create group</button></div>`);
    $('#gCreate', card).onclick = async () => {
      const members = $$('.check:checked', card).map((c) => c.value);
      try {
        const r = await api('/api/groups', { method: 'POST', body: { name: $('#gName', card).value, members } });
        closeModal(); await refreshChats(); S.tab = 'chats'; renderSide(); openChat(r.key);
      } catch (e) { $('#gErr', card).textContent = e.message; }
    };
  }

  function profileModal() {
    const card = openModal(modalHead('Profile') + `<div class="modal-body">
      <div class="profile-top">${avatar(S.me, 'lg')}<h2 style="margin:0;font-weight:400">${esc(S.me.username)}</h2></div>
      <label class="muted">About</label>
      <input class="field" id="pAbout" type="text" maxlength="140" value="${esc(S.me.about || '')}">
      <button class="btn primary" id="pSave">Save</button>
      <button class="btn danger" id="pOut">Log out</button></div>`);
    $('#pSave', card).onclick = async () => {
      try { S.me = await api('/api/me', { method: 'PUT', body: { about: $('#pAbout', card).value } }); S.users[S.me.key] = S.me; closeModal(); toast('Profile updated'); } catch (e) { toast(e.message); }
    };
    $('#pOut', card).onclick = () => { closeModal(); logout(); };
  }

  function infoModal() {
    const ent = entityOf(S.current);
    if (ent.group) {
      openModal(modalHead('Group info') + `<div class="modal-body"><div class="profile-top">${avatar(ent, 'lg')}<h2 style="margin:0;font-weight:400">${esc(ent.name)}</h2><span class="muted">Group · ${ent.members.length} members</span></div>
        <div class="muted">${ent.members.length} members</div>
        <div style="margin:0 -16px">${ent.members.map((k) => { const u = entityOf(k); return `<div class="row" style="cursor:default">${avatar(u, 'md')}<div class="meta"><div class="line"><span class="name" style="font-size:15px">${esc(k === S.me.key ? 'You' : u.username)}</span>${k === ent.admin ? '<small style="color:var(--accent-dark);border:1px solid var(--accent);border-radius:4px;padding:0 5px">Admin</small>' : ''}</div><div class="line"><span class="preview">${esc(u.about || '')}</span></div></div></div>`; }).join('')}</div></div>`);
    } else {
      openModal(modalHead('Contact info') + `<div class="modal-body"><div class="profile-top">${avatar(ent, 'lg')}<h2 style="margin:0;font-weight:400">${esc(ent.username)}</h2><span class="muted">${esc(lastSeen(ent))}</span></div>
        <div class="muted">About</div><div>${esc(ent.about || '')}</div></div>`);
    }
  }

  // ===================================================================
  //  Status (stories)
  // ===================================================================
  const STATUS_COLORS = ['#00a884', '#3f51b5', '#e91e63', '#ff7043', '#8e24aa', '#009688', '#546e7a'];
  function composeStatus() {
    let bg = STATUS_COLORS[0];
    const card = openModal(modalHead('Add status') + `<div class="modal-body">
      <textarea class="field" id="stText" rows="5" maxlength="500" placeholder="Type a status" style="resize:none;color:#fff;background:${bg};font-size:20px;text-align:center"></textarea>
      <div class="swatches">${STATUS_COLORS.map((c, i) => `<button class="swatch ${i ? '' : 'on'}" data-bg="${c}" style="background:${c}"></button>`).join('')}</div>
      <button class="btn primary" id="stPost">Post status</button></div>`);
    card.addEventListener('click', (e) => {
      const s = e.target.closest('[data-bg]');
      if (!s) return;
      bg = s.dataset.bg;
      $$('.swatch', card).forEach((x) => x.classList.toggle('on', x === s));
      $('#stText', card).style.background = bg;
    });
    $('#stPost', card).onclick = async () => {
      try { await api('/api/statuses', { method: 'POST', body: { text: $('#stText', card).value, bg } }); closeModal(); await loadStatuses(); renderSide(); toast('Status posted'); } catch (e) { toast(e.message); }
    };
  }

  let storyTimer;
  function viewStatus(entry, index = 0) {
    if (!entry) return;
    const item = entry.items[index];
    if (!item) return closeModal();
    const card = openModal(`<div class="story" style="background:${esc(item.bg)}">
      <div class="bars">${entry.items.map((_, i) => `<i class="${i < index ? 'done' : i === index ? 'run' : ''}"><b></b></i>`).join('')}</div>
      <div class="who">${avatar(entry.user, 'md')}<div>${esc(entry.mine ? 'My status' : entry.user.username)}<small>${listTime(item.time)} ${hm(item.time)}</small></div></div>
      <div style="white-space:pre-wrap;overflow-wrap:anywhere">${esc(item.text)}</div></div>`, 'viewer');
    card.style.background = 'transparent';
    const next = () => (index + 1 < entry.items.length ? viewStatus(entry, index + 1) : closeModal());
    card.onclick = next;
    clearTimeout(storyTimer);
    storyTimer = setTimeout(next, 5000);
  }

  // ===================================================================
  //  Chat window
  // ===================================================================
  const chatKeyOf = (m) => (isGroup(m.to) ? m.to : m.from === S.me.key ? m.to : m.from);

  function renderHeader() {
    const ent = entityOf(S.current);
    $('#peerAvatar').innerHTML = avatar(ent, 'md');
    $('#peerName').textContent = nameOf(ent);
    updateHeaderStatus();
    const group = isGroup(S.current);
    $('#videoCallBtn').classList.toggle('hidden', group);
    $('#voiceCallBtn').classList.toggle('hidden', group);
  }
  function updateHeaderStatus() {
    if (!S.current) return;
    const ent = entityOf(S.current);
    const t = S.typing[S.current];
    let txt;
    if (t) txt = isGroup(S.current) ? `${t.name} is typing…` : 'typing…';
    else if (ent.group) txt = (ent.members || []).map((k) => (k === S.me.key ? 'You' : userName(k).split(' ')[0])).join(', ');
    else txt = lastSeen(ent);
    $('#peerStatus').textContent = txt;
    $('#peerStatus').style.color = t ? 'var(--accent)' : '';
  }

  async function openChat(key) {
    hidePopup(); closeModal();
    S.current = key; S.replyTo = null; S.messages = [];
    $('#empty').classList.add('hidden');
    $('#chat').classList.remove('hidden');
    $('#app').classList.add('in-chat');
    $('#text').value = ''; autoGrow(); toggleSend();
    $('#emojiPanel').classList.add('hidden');
    renderReply(); renderHeader(); $('#messages').innerHTML = '';
    renderSide();
    try {
      const msgs = await api('/api/messages/' + encodeURIComponent(key));
      if (S.current !== key) return;
      S.messages = msgs;
    } catch (e) { toast(e.message); return; }
    renderMessages();
    markRead();
    if (window.innerWidth > 800) $('#text').focus();
  }

  function markRead() {
    if (!S.current || !socket) return;
    socket.emit('read', { chat: S.current });
    const c = S.chats.find((x) => x.key === S.current);
    if (c && c.unread) { c.unread = 0; updateBadges(); renderSide(); }
  }

  // ---------- messages ----------
  function quoteText(r) {
    if (r.deleted) return '🚫 This message was deleted';
    if (r.text) return r.text;
    return { image: '📷 Photo', video: '🎥 Video', audio: '🎤 Voice message', file: '📄 File' }[r.type] || '';
  }

  function msgHTML(m, prev) {
    if (m.type === 'system') return `<div class="sys" data-id="${m.id}"><span>${esc(m.text)}</span></div>`;
    const mine = m.from === S.me.key;
    const group = isGroup(S.current);
    const cont = prev && prev.type !== 'system' && prev.from === m.from && m.time - prev.time < 120000 && sameDay(new Date(prev.time), new Date(m.time));
    const reactVals = Object.values(m.reactions || {});
    let h = `<div class="msg ${mine ? 'mine' : 'theirs'} ${cont ? 'cont' : 'tail'} ${reactVals.length ? 'has-reacts' : ''}" data-id="${m.id}">`;
    if (!m.deleted) h += `<button class="chev" data-menu="${m.id}" data-popup-owner>${icon('chev')}</button>`;
    if (group && !mine && !cont) h += `<div class="who" style="color:${esc((S.users[m.from] || {}).color || '#00a884')}">${esc(userName(m.from))}</div>`;
    if (m.replyTo) h += `<div class="quote" data-goto="${m.replyTo.id}"><b>${esc(m.replyTo.from === S.me.key ? 'You' : userName(m.replyTo.from))}</b><span>${esc(quoteText(m.replyTo))}</span></div>`;
    if (m.deleted) {
      h += `<div class="deleted">🚫 ${mine ? 'You deleted this message' : 'This message was deleted'}</div>`;
    } else {
      if (m.file) {
        const u = esc(m.file.url);
        if (m.type === 'image') h += `<img class="media" src="${u}" alt="" data-view="${u}">`;
        else if (m.type === 'video') h += `<video class="media" src="${u}" controls preload="metadata"></video>`;
        else if (m.type === 'audio') h += `<audio src="${u}" controls preload="metadata"></audio>`;
        else h += `<a class="file" href="${u}" download="${esc(m.file.name)}" target="_blank" rel="noopener">${icon('doc')}<span>${esc(m.file.name)}<small>${fmtSize(m.file.size)}</small></span></a>`;
      }
      if (m.text) h += `<div class="body">${linkify(m.text)}</div>`;
    }
    h += `<span class="meta">${m.starred ? icon('star', 'star') : ''}${hm(m.time)}${mine && !m.deleted && !group ? tickIcon(m.status) : ''}</span>`;
    if (reactVals.length) {
      const counts = {};
      reactVals.forEach((e) => { counts[e] = (counts[e] || 0) + 1; });
      h += `<div class="reacts">${Object.entries(counts).map(([e, n]) => e + (n > 1 ? ' ' + n : '')).join(' ')}</div>`;
    }
    return h + '</div>';
  }

  function renderMessages() {
    const box = $('#messages');
    let html = '', lastDay = '';
    S.messages.forEach((m, i) => {
      const d = dayLabel(m.time);
      if (d !== lastDay) { html += `<div class="day"><span>${d}</span></div>`; lastDay = d; }
      html += msgHTML(m, S.messages[i - 1]);
    });
    box.innerHTML = html;
    hydrate(box);
    box.scrollTop = box.scrollHeight;
  }

  function appendMessage(m) {
    const box = $('#messages');
    const near = box.scrollHeight - box.scrollTop - box.clientHeight < 160 || m.from === S.me.key;
    const prev = S.messages[S.messages.length - 2];
    let html = '';
    if (!prev || dayLabel(prev.time) !== dayLabel(m.time)) html += `<div class="day"><span>${dayLabel(m.time)}</span></div>`;
    html += msgHTML(m, prev);
    box.insertAdjacentHTML('beforeend', html);
    hydrate(box);
    if (near) box.scrollTop = box.scrollHeight;
  }

  function replaceMessage(m) {
    const el = $(`[data-id="${m.id}"]`, $('#messages'));
    if (!el) return;
    const i = S.messages.indexOf(m);
    el.outerHTML = msgHTML(m, S.messages[i - 1]);
    hydrate($('#messages'));
  }

  $('#messages').addEventListener('click', (e) => {
    const menu = e.target.closest('[data-menu]');
    if (menu) { e.stopPropagation(); return openMsgMenu(menu.dataset.menu, menu); }
    const img = e.target.closest('[data-view]');
    if (img) { const c = openModal(`<button class="icon-btn close" data-close style="color:#fff">${icon('close')}</button><img src="${img.dataset.view}" alt="">`, 'viewer'); c.style.background = '#000'; return; }
    const q = e.target.closest('[data-goto]');
    if (q) {
      const el = $(`.msg[data-id="${q.dataset.goto}"]`, $('#messages'));
      if (el) { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
      return;
    }
    // on phones, tapping a message opens its menu
    const bubble = e.target.closest('.msg');
    if (bubble && window.innerWidth <= 800 && !e.target.closest('a, audio, video, [data-view]')) {
      e.stopPropagation();
      openMsgMenu(bubble.dataset.id, bubble);
    }
  });

  function openMsgMenu(id, btn) {
    const m = S.messages.find((x) => x.id === id);
    if (!m) return;
    const mine = m.from === S.me.key;
    let h = '';
    if (!m.deleted) h += `<div class="react-bar">${['👍', '❤️', '😂', '😮', '😢', '🙏'].map((e) => `<button data-react="${e}">${e}</button>`).join('')}</div>`;
    if (!m.deleted) h += `<button data-act="reply">${icon('reply')}Reply</button>`;
    if (m.text && !m.deleted) h += `<button data-act="copy">${icon('copy')}Copy</button>`;
    h += `<button data-act="star">${icon('star')}${m.starred ? 'Unstar' : 'Star'}</button>`;
    if (mine && !m.deleted) h += `<button data-act="delete">${icon('trash')}Delete</button>`;
    showPopup(btn, h);
    $('#popup').onclick = (e) => {
      const r = e.target.closest('[data-react]'), a = e.target.closest('[data-act]');
      if (!r && !a) return;
      hidePopup();
      if (r) return socket.emit('react', { id, emoji: r.dataset.react });
      if (a.dataset.act === 'reply') { S.replyTo = m; renderReply(); $('#text').focus(); }
      if (a.dataset.act === 'copy') navigator.clipboard && navigator.clipboard.writeText(m.text).then(() => toast('Copied'));
      if (a.dataset.act === 'star') socket.emit('star', { id }, (res) => { if (res && res.ok) { m.starred = res.starred; replaceMessage(m); } });
      if (a.dataset.act === 'delete' && confirm('Delete this message for everyone?')) socket.emit('delete', { id });
    };
  }

  // ---------- header buttons ----------
  $('#backBtn').addEventListener('click', () => {
    S.current = null; $('#chat').classList.add('hidden'); $('#empty').classList.remove('hidden');
    $('#app').classList.remove('in-chat'); renderSide();
  });
  $('#headInfo').addEventListener('click', infoModal);
  $('#voiceCallBtn').addEventListener('click', () => startCall(S.current, false));
  $('#videoCallBtn').addEventListener('click', () => startCall(S.current, true));
  $('#chatMenuBtn').addEventListener('click', () => {
    showPopup($('#chatMenuBtn'), `<button data-cm="info">${icon('user')}${isGroup(S.current) ? 'Group info' : 'Contact info'}</button><button data-cm="close">${icon('close')}Close chat</button>`);
    $('#popup').onclick = (e) => {
      const b = e.target.closest('[data-cm]');
      if (!b) return;
      hidePopup();
      if (b.dataset.cm === 'info') infoModal(); else $('#backBtn').click();
    };
  });

  // ===================================================================
  //  Composer
  // ===================================================================
  const textEl = $('#text');
  function autoGrow() { textEl.style.height = 'auto'; textEl.style.height = Math.min(textEl.scrollHeight, 120) + 'px'; }
  function toggleSend() {
    const has = textEl.value.trim().length > 0;
    $('#sendBtn').classList.toggle('hidden', !has);
    $('#micBtn').classList.toggle('hidden', has);
  }
  let typingTimer = null, typingSent = false;
  textEl.addEventListener('input', () => {
    autoGrow(); toggleSend();
    if (!S.current || !socket) return;
    if (!typingSent) { socket.emit('typing', { to: S.current, typing: true }); typingSent = true; }
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => { socket.emit('typing', { to: S.current, typing: false }); typingSent = false; }, 1500);
  });
  textEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText(); }
    if (e.key === 'Escape') { S.replyTo = null; renderReply(); }
  });
  $('#sendBtn').addEventListener('click', sendText);

  function sendText() {
    const text = textEl.value.trim();
    if (!text || !S.current) return;
    textEl.value = ''; autoGrow(); toggleSend();
    clearTimeout(typingTimer);
    if (typingSent) { socket.emit('typing', { to: S.current, typing: false }); typingSent = false; }
    sendPayload({ text });
  }
  function sendPayload(extra) {
    socket.emit('message', { to: S.current, replyTo: S.replyTo ? S.replyTo.id : null, ...extra }, (res) => { if (res && res.error) toast(res.error); });
    S.replyTo = null; renderReply();
  }
  function renderReply() {
    const bar = $('#replyBar');
    if (!S.replyTo) { bar.classList.add('hidden'); bar.innerHTML = ''; return; }
    bar.classList.remove('hidden');
    bar.innerHTML = `<div class="quote"><b>${esc(S.replyTo.from === S.me.key ? 'You' : userName(S.replyTo.from))}</b><span>${esc(quoteText(S.replyTo))}</span></div><button class="icon-btn" id="replyX">${icon('close')}</button>`;
    $('#replyX').onclick = () => { S.replyTo = null; renderReply(); };
  }

  // ---------- emoji ----------
  const EMOJIS = '😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 😉 😍 🥰 😘 😋 😛 😜 🤪 😎 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🤭 🤫 🤥 😶 😐 😑 😬 🙄 😯 😲 😴 🤤 😪 😵 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤠 😈 👻 💀 🤖 🎃 👍 👎 👏 🙌 🙏 🤝 💪 👌 ✌️ 🤞 🤟 🤘 👋 ✋ 👀 ❤️ 🧡 💛 💚 💙 💜 🖤 🤍 💔 ❣️ 💕 💞 💯 🔥 ✨ ⭐ 🎉 🎊 🎁 🎂 ☕ 🍕 🍔 🍟 🍿 🍫 🍎 ⚽ 🏏 🎮 🎵 📚 📝 💻 📱 💡 ✅ ❌ ⚠️ 🚀 🌙 ☀️ 🌈 🌹'.split(' ');
  $('#emojiPanel').innerHTML = EMOJIS.map((e) => `<button data-e="${e}">${e}</button>`).join('');
  $('#emojiBtn').addEventListener('click', () => $('#emojiPanel').classList.toggle('hidden'));
  $('#emojiPanel').addEventListener('click', (e) => {
    const b = e.target.closest('[data-e]');
    if (!b) return;
    const s = textEl.selectionStart || textEl.value.length;
    textEl.value = textEl.value.slice(0, s) + b.dataset.e + textEl.value.slice(textEl.selectionEnd || s);
    textEl.focus(); textEl.selectionStart = textEl.selectionEnd = s + b.dataset.e.length;
    autoGrow(); toggleSend();
  });

  // ---------- attachments ----------
  $('#attachBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    showPopup($('#attachBtn'), `<button data-at="media">${icon('image')}Photos & videos</button><button data-at="doc">${icon('doc')}Document</button>`);
    const p = $('#popup');
    p.style.top = ($('#attachBtn').getBoundingClientRect().top - p.offsetHeight - 6) + 'px';
    p.style.left = $('#attachBtn').getBoundingClientRect().left + 'px';
    p.onclick = (ev) => {
      const b = ev.target.closest('[data-at]');
      if (!b) return;
      hidePopup();
      (b.dataset.at === 'media' ? $('#fileMedia') : $('#fileDoc')).click();
    };
  });
  [$('#fileDoc'), $('#fileMedia')].forEach((inp) => inp.addEventListener('change', () => {
    const f = inp.files[0]; inp.value = '';
    if (f) uploadAndSend(f, f.name);
  }));

  const toB64 = (blob) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(blob); });
  async function uploadAndSend(blob, name) {
    if (!S.current) return;
    if (blob.size > 10 * 1024 * 1024) return toast('File must be under 10 MB');
    toast('Sending…');
    try {
      const file = await api('/api/upload', { method: 'POST', body: { name, mime: blob.type || 'application/octet-stream', data: await toB64(blob) } });
      sendPayload({ file });
      $('#toast').classList.add('hidden');
    } catch (e) { toast(e.message); }
  }

  // ---------- voice notes ----------
  let rec = null, recStream = null, recChunks = [], recStart = 0, recInt = null;
  $('#micBtn').addEventListener('click', async () => {
    if (!navigator.mediaDevices || !window.MediaRecorder) return toast('Voice messages are not supported in this browser');
    try { recStream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { return toast('Microphone permission denied'); }
    recChunks = [];
    rec = new MediaRecorder(recStream);
    rec.ondataavailable = (e) => { if (e.data.size) recChunks.push(e.data); };
    rec.start();
    recStart = Date.now();
    $('#composer').classList.add('hidden'); $('#recBar').classList.remove('hidden');
    $('#recTime').textContent = '0:00';
    recInt = setInterval(() => { $('#recTime').textContent = fmtDur((Date.now() - recStart) / 1000); }, 500);
  });
  function stopRec(send) {
    if (!rec) return;
    clearInterval(recInt);
    const r = rec, stream = recStream, mime = r.mimeType || 'audio/webm';
    rec = null; recStream = null;
    r.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      if (send && recChunks.length) uploadAndSend(new Blob(recChunks, { type: mime }), 'voice-message.' + (mime.includes('mp4') ? 'm4a' : mime.includes('ogg') ? 'ogg' : 'webm'));
    };
    r.stop();
    $('#recBar').classList.add('hidden'); $('#composer').classList.remove('hidden');
  }
  $('#recCancel').addEventListener('click', () => stopRec(false));
  $('#recSend').addEventListener('click', () => stopRec(true));

  // ===================================================================
  //  Sockets
  // ===================================================================
  function connectSocket() {
    if (socket) socket.disconnect();
    socket = io({ auth: { token: S.token } });
    socket.on('connect_error', (err) => { if (err.message === 'unauthorized') logout(); });
    socket.on('connect', () => { if (S.me) { refreshChats().then(renderSide).catch(() => {}); if (S.current) markRead(); } });

    socket.on('message', async (m) => {
      const key = chatKeyOf(m);
      let c = S.chats.find((x) => x.key === key);
      if (!c) { await refreshChats(); c = S.chats.find((x) => x.key === key); }
      if (!c) return;
      c.last = m;
      const fromOther = m.from !== S.me.key;
      const viewing = key === S.current && !document.hidden;
      if (fromOther && !viewing && m.type !== 'system') { c.unread = (c.unread || 0) + 1; beep(); }
      if (fromOther) delete S.typing[key];
      S.chats.sort((a, b) => (b.last ? b.last.time : 0) - (a.last ? a.last.time : 0));
      if (key === S.current && !S.messages.some((x) => x.id === m.id)) {
        S.messages.push(m); appendMessage(m);
        if (fromOther && viewing) markRead();
      }
      updateBadges(); if (S.tab === 'chats') renderSide(); updateHeaderStatus();
    });

    socket.on('status', ({ ids, status }) => {
      (ids || []).forEach((id) => {
        const m = S.messages.find((x) => x.id === id);
        if (m) { m.status = status; replaceMessage(m); }
        const c = S.chats.find((x) => x.last && x.last.id === id);
        if (c) c.last.status = status;
      });
      if (S.tab === 'chats') renderSide();
    });

    socket.on('deleted', ({ id }) => {
      const m = S.messages.find((x) => x.id === id);
      if (m) { m.deleted = true; m.text = ''; m.file = null; m.reactions = {}; replaceMessage(m); }
      const c = S.chats.find((x) => x.last && x.last.id === id);
      if (c) { c.last.deleted = true; c.last.text = ''; }
      if (S.tab === 'chats') renderSide();
    });

    socket.on('reaction', ({ id, reactions }) => {
      const m = S.messages.find((x) => x.id === id);
      if (m) { m.reactions = reactions; replaceMessage(m); }
    });

    socket.on('presence', ({ user, online, lastSeen: ls }) => {
      if (S.users[user]) { S.users[user].online = online; if (ls) S.users[user].lastSeen = ls; }
      else if (S.me && user !== S.me.key) loadContacts().then(() => { if (S.tab === 'chats') renderSide(); });
      if (S.tab === 'chats') renderSide();
      updateHeaderStatus();
    });

    socket.on('typing', ({ from, chat, typing }) => {
      clearTimeout((S.typing[chat] || {}).timer);
      if (typing) {
        S.typing[chat] = { name: userName(from).split(' ')[0], timer: setTimeout(() => { delete S.typing[chat]; if (S.tab === 'chats') renderSide(); updateHeaderStatus(); }, 4000) };
      } else delete S.typing[chat];
      if (S.tab === 'chats') renderSide();
      updateHeaderStatus();
    });

    socket.on('chats-changed', () => refreshChats().then(() => { if (S.tab === 'chats') renderSide(); }));

    // ----- call signalling -----
    socket.on('call:incoming', onIncomingCall);
    socket.on('call:answered', onCallAnswered);
    socket.on('call:ice', async ({ callId, candidate }) => {
      if (!call || call.id !== callId) return;
      if (call.pc && call.pc.remoteDescription) { try { await call.pc.addIceCandidate(candidate); } catch (e) { /* ignore */ } } else call.pendingIce.push(candidate);
    });
    socket.on('call:ended', ({ callId }) => { if (call && call.id === callId) endCall(false, 'Call ended'); });
    socket.on('call:rejected', ({ callId }) => { if (call && call.id === callId) endCall(false, 'Call declined'); });
    socket.on('call:handled', ({ callId }) => { if (call && call.id === callId && call.state === 'ringing') endCall(false); });
    socket.on('call:unavailable', ({ callId, reason }) => {
      if (call && call.id === callId) endCall(false, reason === 'offline' ? 'User is offline' : reason === 'noanswer' ? 'No answer' : 'Cannot call right now');
    });
  }

  document.addEventListener('visibilitychange', () => { if (!document.hidden && S.current) markRead(); });

  // ===================================================================
  //  Voice & video calls (WebRTC; demo contacts use a simulated call)
  // ===================================================================
  let call = null, callTimer = null;
  const ICE = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  function makePC() {
    const pc = new RTCPeerConnection(ICE);
    pc.onicecandidate = (e) => { if (e.candidate && call) socket.emit('call:ice', { callId: call.id, candidate: e.candidate }); };
    pc.ontrack = (e) => {
      const rv = $('#remoteVideo');
      rv.srcObject = e.streams[0];
      rv.classList.toggle('off', !call.video);
      $('#callUI').classList.toggle('has-remote', !!call.video);
      rv.play().catch(() => {});
    };
    pc.onconnectionstatechange = () => { if (call && call.pc === pc && ['failed', 'closed'].includes(pc.connectionState)) endCall(true, 'Call disconnected'); };
    return pc;
  }
  async function getMedia(video) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('Calls need HTTPS or localhost');
    try { return await navigator.mediaDevices.getUserMedia({ audio: true, video: video ? { facingMode: 'user' } : false }); } catch (e) {
      throw new Error(video ? 'Camera or microphone is not available' : 'Microphone is not available');
    }
  }

  function showCallUI() {
    const ent = entityOf(call.peer);
    $('#callAvatar').innerHTML = avatar(ent);
    $('#callName').textContent = ent.username;
    $('#callUI').classList.remove('hidden', 'has-remote');
    $('#remoteVideo').classList.add('off');
    $('#localVideo').srcObject = call.local || null;
    $('#localVideo').classList.toggle('hidden', !call.video);
    $('#btnCam').classList.toggle('hidden', !call.video);
    $('#btnMute').classList.remove('off'); $('#btnCam').classList.remove('off');
    setCallState(call.incoming ? 'Connecting…' : 'Calling…');
  }
  const setCallState = (t) => { $('#callState').textContent = t; };

  function startTimer() {
    call.state = 'connected';
    const t0 = Date.now();
    clearInterval(callTimer);
    const tick = () => setCallState(fmtDur((Date.now() - t0) / 1000));
    tick(); callTimer = setInterval(tick, 1000);
  }

  async function startCall(peer, video) {
    if (!peer || isGroup(peer) || !socket) return;
    if (call) return toast('You are already in a call');
    const ent = entityOf(peer);
    let stream;
    try { stream = await getMedia(video); } catch (e) { return toast(e.message); }
    call = { id: uid(), peer, video, local: stream, state: 'calling', sim: !!ent.bot, pendingIce: [] };
    showCallUI();
    if (call.sim) { socket.emit('call:invite', { to: peer, video, callId: call.id }); return; }
    try {
      const pc = makePC(); call.pc = pc;
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));
      await pc.setLocalDescription(await pc.createOffer());
      socket.emit('call:invite', { to: peer, video, callId: call.id, offer: pc.localDescription });
    } catch (e) { endCall(true, 'Could not start the call'); }
  }

  function onIncomingCall({ callId, from, video, offer }) {
    if (call) { socket.emit('call:reject', { callId }); return; }
    call = { id: callId, peer: from, video, offer, incoming: true, state: 'ringing', pendingIce: [] };
    const ent = entityOf(from);
    $('#inAvatar').innerHTML = avatar(ent, 'md');
    $('#inName').textContent = ent.username || from;
    $('#inKind').textContent = video ? 'Incoming video call…' : 'Incoming voice call…';
    $('#inUI').classList.remove('hidden');
    startRing();
  }

  $('#btnAccept').addEventListener('click', async () => {
    if (!call || call.state !== 'ringing') return;
    stopRing(); $('#inUI').classList.add('hidden');
    const c = call;
    try {
      c.local = await getMedia(c.video);
      showCallUI();
      const pc = makePC(); c.pc = pc;
      c.local.getTracks().forEach((t) => pc.addTrack(t, c.local));
      await pc.setRemoteDescription(c.offer);
      for (const cand of c.pendingIce) { try { await pc.addIceCandidate(cand); } catch (e) { /* ignore */ } }
      c.pendingIce = [];
      await pc.setLocalDescription(await pc.createAnswer());
      socket.emit('call:answer', { callId: c.id, answer: pc.localDescription });
      startTimer();
    } catch (e) {
      socket.emit('call:reject', { callId: c.id });
      endCall(false, e.message || 'Could not answer the call');
    }
  });
  $('#btnDecline').addEventListener('click', () => {
    if (!call) return;
    socket.emit('call:reject', { callId: call.id });
    endCall(false);
  });

  async function onCallAnswered({ callId, answer, sim }) {
    if (!call || call.id !== callId) return;
    if (!sim && answer && call.pc) {
      try {
        await call.pc.setRemoteDescription(answer);
        for (const cand of call.pendingIce) { try { await call.pc.addIceCandidate(cand); } catch (e) { /* ignore */ } }
        call.pendingIce = [];
      } catch (e) { return endCall(true, 'Could not connect'); }
    }
    startTimer();
  }

  function endCall(notify, msg) {
    if (!call) return;
    const c = call;
    if (notify) socket && socket.emit('call:end', { callId: c.id });
    stopRing(); clearInterval(callTimer);
    if (c.local) c.local.getTracks().forEach((t) => t.stop());
    if (c.pc) { c.pc.onconnectionstatechange = null; c.pc.close(); }
    $('#remoteVideo').srcObject = null; $('#localVideo').srcObject = null;
    $('#callUI').classList.add('hidden'); $('#inUI').classList.add('hidden');
    call = null;
    if (msg) toast(msg);
    if (S.tab === 'calls') loadCalls().then(renderSide).catch(() => {});
  }
  $('#btnEnd').addEventListener('click', () => endCall(true));
  $('#btnMute').addEventListener('click', (e) => {
    if (!call || !call.local) return;
    const t = call.local.getAudioTracks()[0]; if (!t) return;
    t.enabled = !t.enabled; e.currentTarget.classList.toggle('off', !t.enabled); e.currentTarget.textContent = t.enabled ? '🎤' : '🔇';
  });
  $('#btnCam').addEventListener('click', (e) => {
    if (!call || !call.local) return;
    const t = call.local.getVideoTracks()[0]; if (!t) return;
    t.enabled = !t.enabled; e.currentTarget.classList.toggle('off', !t.enabled);
  });
  window.addEventListener('beforeunload', () => { if (call && socket) socket.emit('call:end', { callId: call.id }); });

  // ===================================================================
  //  Keyboard & boot
  // ===================================================================
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!$('#modal').classList.contains('hidden')) closeModal();
    hidePopup();
  });

  hydrate();
  if (S.token) start();
})();
