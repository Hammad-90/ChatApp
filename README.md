# ChatApp – Real-time Messaging Web App

A WhatsApp-style chat application with a Node.js backend and a browser frontend.
Built as a university assignment.

## Features

**Messaging**
- Register / login (passwords hashed with scrypt, persistent sessions)
- One-to-one and **group chats**, real time (WebSockets / Socket.IO)
- Sent ✓ / delivered ✓✓ / read (blue ✓✓) ticks
- Online / last-seen status and "typing…" indicator
- Reply to a message, emoji reactions, star, copy, delete for everyone
- Emoji picker, clickable links
- Send photos, videos and documents (up to 10 MB)
- **Voice notes** (record from the microphone)
- Unread badges, last-message preview, search, All / Unread / Groups filters

**Calls**
- **Voice and video calls** between two real users using WebRTC
  (Socket.IO is used as the signalling server)
- Incoming-call screen with ringtone, accept / decline, mute, camera on/off, call timer
- Call history tab (incoming, outgoing, missed, declined)

**Other**
- **Status** tab (24-hour text statuses with colours, story viewer)
- Profile with editable "About"
- Light and dark theme, responsive layout (desktop and phone)
- **Demo contacts**: every new account automatically gets four demo contacts
  (Ayesha, Ali, Prof. Sara, Mom) and a class group. They reply automatically and
  "answer" calls, so the app can be demonstrated with a single user.

## Tech stack

| Layer      | Technology                                   |
|------------|----------------------------------------------|
| Backend    | Node.js, Express, Socket.IO                  |
| Frontend   | HTML, CSS, vanilla JavaScript                |
| Calls      | WebRTC (peer to peer), STUN                  |
| Storage    | JSON file (`data.json`) + `uploads/` folder  |

## Run it

```bash
npm install
npm start
```

Open http://localhost:3000

* To test **real** chats and calls, open the app in two browsers (or a normal and an
  incognito window), create two accounts and chat / call each other.
  Allow microphone / camera access when the browser asks.
* Calls need `localhost` or HTTPS (a browser rule for camera and microphone).

## Automated test

```bash
npm test
```
Starts the server and checks registration, login, messaging, read receipts, typing,
reactions, deletion, file upload, groups, the call signalling flow, statuses and security checks.

## Project structure

```
chatapp/
├── server.js          REST API + Socket.IO (chat, groups, calls signalling)
├── test.js            End-to-end backend test
├── package.json
├── data.json          Created automatically (users, messages, calls …)
├── uploads/           Created automatically (files sent in chats)
└── public/
    ├── index.html     Page structure
    ├── style.css      WhatsApp-like styling, dark mode, responsive
    └── app.js         Client logic (chats, calls, voice notes, status …)
```

## API

| Method | Route                | Description                              |
|--------|----------------------|------------------------------------------|
| POST   | /api/register        | Create account                           |
| POST   | /api/login           | Log in                                   |
| GET/PUT| /api/me              | Own profile / update "About"             |
| GET    | /api/contacts        | All users with presence                  |
| GET    | /api/chats           | Chat list with last message and unread   |
| GET    | /api/messages/:chat  | History of a chat (user key or `g:id`)   |
| POST   | /api/upload          | Upload a file (base64)                   |
| POST   | /api/groups          | Create a group                           |
| GET    | /api/calls           | Call history                             |
| GET/POST | /api/statuses      | 24-hour statuses                         |

**Socket events** – client → server: `message`, `read`, `typing`, `delete`, `react`, `star`,
`call:invite`, `call:answer`, `call:reject`, `call:ice`, `call:end`.
Server → client: `message`, `status`, `typing`, `presence`, `deleted`, `reaction`,
`chats-changed`, `call:incoming`, `call:answered`, `call:ice`, `call:ended`,
`call:rejected`, `call:unavailable`, `call:handled`.

## How calls work (for the report)

1. The caller creates an `RTCPeerConnection`, an SDP *offer*, and sends it through the
   server with `call:invite`.
2. The server relays it to the callee (`call:incoming`). The callee accepts, creates an
   *answer* and sends it back (`call:answer`).
3. Both sides exchange ICE candidates through the server (`call:ice`) and then stream
   audio / video **directly to each other** (peer to peer).
4. The server only stores the call log (who, when, duration, status).

## Limitations

- JSON file storage is used instead of a database to keep setup simple.
  A production system would use MongoDB or PostgreSQL.
- Messages are not end-to-end encrypted.
- Calls are one-to-one only. Across strict firewalls a TURN server would be needed.
- Demo contacts are simulated: they reply with canned messages and their calls have no media.
