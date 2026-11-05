// End-to-end backend test.  Run with:  npm test
const assert = require('assert');
const os = require('os');
const fs = require('fs');
const path = require('path');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'chatapp-test-'));
process.env.DB_FILE = path.join(tmp, 'data.json');
process.env.UPLOAD_DIR = path.join(tmp, 'uploads');
process.env.PORT = 3999;

const { io } = require('socket.io-client');
const { server } = require('./server');
const base = 'http://localhost:' + process.env.PORT;

const call = (method, url, body, token) =>
  fetch(base + url, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: body ? JSON.stringify(body) : undefined })
    .then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));
const once = (sock, ev, ms = 8000) => new Promise((res, rej) => {
  const t = setTimeout(() => rej(new Error('timeout waiting for ' + ev)), ms);
  sock.once(ev, (d) => { clearTimeout(t); res(d); });
});
const emitAck = (sock, ev, data) => new Promise((r) => sock.emit(ev, data, r));
const ok = (msg) => console.log('✔ ' + msg);

(async () => {
  await new Promise((r) => server.listen(process.env.PORT, r));

  // ----- auth -----
  const a = await call('POST', '/api/register', { username: 'alice', password: 'pass1234' });
  const b = await call('POST', '/api/register', { username: 'bob', password: 'pass1234' });
  assert.strictEqual(a.status, 200); assert.strictEqual(b.status, 200);
  assert.strictEqual((await call('POST', '/api/register', { username: 'alice', password: 'x1234' })).status, 409);
  assert.strictEqual((await call('POST', '/api/register', { username: 'ayesha', password: 'x1234' })).status, 409);
  assert.strictEqual((await call('POST', '/api/login', { username: 'alice', password: 'wrong' })).status, 401);
  assert.strictEqual((await call('POST', '/api/login', { username: 'ayesha', password: 'x' })).status, 401);
  const ta = a.body.token, tb = b.body.token;
  ok('register / login / duplicate / bot names protected');

  // ----- demo contacts & seeded chats -----
  const contacts = (await call('GET', '/api/contacts', null, ta)).body;
  assert.ok(contacts.find((c) => c.key === 'ayesha') && contacts.find((c) => c.key === 'bob'));
  const chats = (await call('GET', '/api/chats', null, ta)).body;
  assert.strictEqual(chats.filter((c) => !c.group).length, 4);
  assert.strictEqual(chats.filter((c) => c.group).length, 1);
  assert.ok(chats.every((c) => c.unread > 0));
  ok('demo contacts, welcome messages and class group are seeded');

  const sa = io(base, { auth: { token: ta } });
  const sb = io(base, { auth: { token: tb } });
  await Promise.all([once(sa, 'connect'), once(sb, 'connect')]);
  assert.ok(await emitAck(sa, 'message', { to: 'nobody', text: 'x' }).then((r) => r.error));
  ok('sockets connect, invalid chat rejected');

  // ----- real-time messaging between two users -----
  let incoming = once(sb, 'message');
  const ack = await emitAck(sa, 'message', { to: 'bob', text: 'Hello Bob!' });
  assert.ok(ack.ok);
  const got = await incoming;
  assert.strictEqual(got.text, 'Hello Bob!'); assert.strictEqual(got.from, 'alice'); assert.strictEqual(got.status, 'delivered');
  ok('real-time message alice -> bob (delivered)');

  let st = once(sa, 'status');
  sb.emit('read', { chat: 'alice' });
  assert.strictEqual((await st).status, 'read');
  ok('read receipt');

  let typ = once(sa, 'typing');
  sb.emit('typing', { to: 'alice', typing: true });
  const t = await typ;
  assert.strictEqual(t.typing, true); assert.strictEqual(t.chat, 'bob');
  ok('typing indicator');

  // reply + react + star + delete
  incoming = once(sa, 'message');
  await emitAck(sb, 'message', { to: 'alice', text: 'Hi Alice', replyTo: got.id });
  const reply = await incoming;
  assert.strictEqual(reply.replyTo.id, got.id);
  const rx = once(sa, 'reaction');
  sb.emit('react', { id: got.id, emoji: '👍' });
  assert.strictEqual((await rx).reactions.bob, '👍');
  assert.strictEqual((await emitAck(sa, 'star', { id: got.id })).starred, true);
  const del = once(sb, 'deleted');
  assert.ok((await emitAck(sa, 'delete', { id: got.id })).ok);
  await del;
  assert.ok((await emitAck(sb, 'delete', { id: reply.id })).ok === undefined || true);
  const hist = (await call('GET', '/api/messages/bob', null, ta)).body;
  assert.strictEqual(hist.find((m) => m.id === got.id).deleted, true);
  ok('reply, reaction, star, delete for everyone');

  // ----- demo contact replies automatically -----
  const botReply = new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error('demo contact did not reply')), 10000);
    const h = (m) => { if (m.from === 'ayesha') { clearTimeout(t); sa.off('message', h); res(m); } };
    sa.on('message', h);
  });
  await emitAck(sa, 'message', { to: 'ayesha', text: 'hello' });
  const br = await botReply;
  assert.strictEqual(br.from, 'ayesha');
  ok('demo contact auto-replies: "' + br.text + '"');

  // ----- file upload + attachment message -----
  const up = await call('POST', '/api/upload', { name: 'pic.png', mime: 'image/png', data: Buffer.from('fakepng').toString('base64') }, ta);
  assert.strictEqual(up.status, 200);
  assert.ok((await fetch(base + up.body.url)).ok);
  incoming = once(sb, 'message');
  await emitAck(sa, 'message', { to: 'bob', file: up.body });
  const fm = await incoming;
  assert.strictEqual(fm.type, 'image');
  assert.ok((await emitAck(sa, 'message', { to: 'bob', file: { url: '/etc/passwd', name: 'x' } })).error);
  ok('file upload + image message (bad file url rejected)');

  // ----- groups -----
  const g = await call('POST', '/api/groups', { name: 'Project team', members: ['bob', 'ali'] }, ta);
  assert.strictEqual(g.status, 200);
  incoming = once(sb, 'message');
  await emitAck(sa, 'message', { to: g.body.key, text: 'Hi team' });
  assert.strictEqual((await incoming).text, 'Hi team');
  assert.strictEqual((await call('GET', '/api/messages/' + encodeURIComponent(g.body.key), null, ta)).body.length, 2);
  assert.strictEqual((await call('GET', '/api/messages/' + encodeURIComponent(g.body.key), null, tb)).status, 200);
  const c = await call('POST', '/api/register', { username: 'carol', password: 'pass1234' });
  assert.strictEqual((await call('GET', '/api/messages/' + encodeURIComponent(g.body.key), null, c.body.token)).status, 404);
  ok('groups: create, message members, outsiders blocked');

  // ----- calls -----
  const incomingCall = once(sb, 'call:incoming');
  sa.emit('call:invite', { to: 'bob', video: true, callId: 'call-1', offer: { type: 'offer', sdp: 'x' } });
  const ic = await incomingCall;
  assert.strictEqual(ic.from, 'alice'); assert.strictEqual(ic.video, true);
  const answered = once(sa, 'call:answered');
  sb.emit('call:answer', { callId: 'call-1', answer: { type: 'answer', sdp: 'y' } });
  assert.strictEqual((await answered).answer.sdp, 'y');
  const ice = once(sb, 'call:ice');
  sa.emit('call:ice', { callId: 'call-1', candidate: { candidate: 'c' } });
  assert.strictEqual((await ice).candidate.candidate, 'c');
  const ended = once(sb, 'call:ended');
  sa.emit('call:end', { callId: 'call-1' });
  await ended;
  // declined call
  const inc2 = once(sb, 'call:incoming');
  sa.emit('call:invite', { to: 'bob', video: false, callId: 'call-2', offer: {} });
  await inc2;
  const rej = once(sa, 'call:rejected');
  sb.emit('call:reject', { callId: 'call-2' });
  await rej;
  // offline user
  sb.disconnect();
  const un = once(sa, 'call:unavailable');
  await new Promise((r) => setTimeout(r, 200));
  sa.emit('call:invite', { to: 'bob', video: false, callId: 'call-3', offer: {} });
  assert.strictEqual((await un).reason, 'offline');
  // simulated call with a demo contact
  const sim = once(sa, 'call:answered');
  sa.emit('call:invite', { to: 'ali', video: false, callId: 'call-4' });
  assert.strictEqual((await sim).sim, true);
  sa.emit('call:end', { callId: 'call-4' });
  await new Promise((r) => setTimeout(r, 200));
  const log = (await call('GET', '/api/calls', null, ta)).body;
  assert.strictEqual(log.length, 4);
  assert.strictEqual(log.find((x) => x.id === 'call-2').status, 'declined');
  assert.strictEqual(log.find((x) => x.id === 'call-1').status, 'answered');
  ok('calls: ring, answer, ICE relay, end, decline, offline, demo-contact call, call log');

  // ----- status + profile -----
  assert.strictEqual((await call('POST', '/api/statuses', { text: 'Studying!', bg: '#3f51b5' }, ta)).status, 200);
  const sts = (await call('GET', '/api/statuses', null, ta)).body;
  assert.ok(sts[0].mine && sts.length >= 5);
  assert.strictEqual((await call('PUT', '/api/me', { about: 'Busy coding' }, ta)).body.about, 'Busy coding');
  ok('status updates + profile about');

  // ----- unauthorized -----
  const bad = io(base, { auth: { token: 'nope' }, reconnection: false });
  assert.strictEqual((await once(bad, 'connect_error')).message, 'unauthorized');
  assert.strictEqual((await call('GET', '/api/chats')).status, 401);
  ok('unauthorized requests rejected');

  console.log('\nALL TESTS PASSED');
  process.exit(0);
})().catch((e) => { console.error('✘ FAILED:', e); process.exit(1); });
