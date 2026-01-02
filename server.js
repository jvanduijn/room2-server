// server.js
const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: "*" }
});

// static files (index.html etc.)
app.use(express.static(__dirname));

// --- HOST STATE ---
let hostRoom       = 'room5';   // living room
let hostConnected  = false;
let hostSocketId   = null;

// --- PLAYER STATE (for ghost player) ---
const playerRooms = new Map(); // socketId -> roomId

// --- CONVERSATION STATE ---
let currentConversationId = null;
let conversationResponses = [];
let conversationTimeout   = null;

// shorter, more natural
const CONVERSATION_DURATION_MS = 6000;

function clearConversationState() {
  currentConversationId = null;
  conversationResponses = [];
  if (conversationTimeout) {
    clearTimeout(conversationTimeout);
    conversationTimeout = null;
  }
}

io.on('connection', (socket) => {
  console.log('Client connected', socket.id);

  // --- JOIN ---
  socket.on('join', ({ role }) => {
    socket.data.role = role;
    console.log(`Client ${socket.id} joined as ${role}`);

    if (role === 'host') {
      // host is not "online" for players yet until hostReady
      hostSocketId = socket.id;
      socket.emit('initialHostPosition', { roomId: hostRoom });
    } else {
      // player: only show host if host is actually online
      if (hostConnected) {
        socket.emit('hostPosition', { roomId: hostRoom });
      }
    }
  });

  // host confirms login success
  socket.on('hostReady', () => {
    if (socket.id !== hostSocketId) return;
    hostConnected = true;
    console.log('Host is now ready/online');

    // tell all players host just appeared
    socket.broadcast.emit('hostOnline', { roomId: hostRoom });
  });

  // --- HOST MOVEMENT (blue character) ---
  socket.on('hostMove', ({ roomId }) => {
    if (socket.data.role !== 'host') return;
    if (!roomId) return;

    hostRoom = roomId;
    console.log('Host moved to room:', hostRoom);

    // notify players
    socket.broadcast.emit('hostPosition', { roomId: hostRoom });
  });

  // --- PLAYER MOVEMENT (for ghost player) ---
  socket.on('playerMove', ({ roomId }) => {
    if (socket.data.role === 'host') return;
    if (!roomId) return;
    playerRooms.set(socket.id, roomId);
  });

  // --- HOST ACTIONS (sleep, tvOn, etc.) ---
  socket.on('hostAction', (data) => {
    if (socket.data.role !== 'host') return;
    if (!data || !data.kind) return;

    // broadcast to players
    socket.broadcast.emit('hostAction', { kind: data.kind });
  });

  // --- CONVERSATION START (host presses "2") ---
  socket.on('startConversation', () => {
    if (socket.data.role !== 'host') return;
    if (currentConversationId) return; // already running

    const conversationId =
      Date.now().toString() + '-' + Math.random().toString(36).slice(2);

    currentConversationId = conversationId;
    conversationResponses = [];

    console.log('Conversation started', conversationId);

    // notify everyone (host + players)
    io.emit('conversationStart', { conversationId });

    // after timeout, pick a response for host
    conversationTimeout = setTimeout(() => {
      console.log('Conversation ending', conversationId);

      let chosenMessage = null;
      if (conversationResponses.length > 0) {
        const idx = Math.floor(Math.random() * conversationResponses.length);
        chosenMessage = conversationResponses[idx].text;
      }

      // send chosen response only to host
      if (hostSocketId && hostConnected) {
        io.to(hostSocketId).emit('conversationResult', {
          conversationId,
          message: chosenMessage || null
        });
      }

      // end for everyone
      io.emit('conversationEnd', { conversationId });
      clearConversationState();
    }, CONVERSATION_DURATION_MS);
  });

  // --- PLAYER MESSAGES DURING CONVERSATION ---
  socket.on('playerMessage', ({ conversationId, text }) => {
    if (!currentConversationId) return;
    if (conversationId !== currentConversationId) return;

    const trimmed = (text || '').toString().slice(0, 120);
    if (!trimmed) return;

    conversationResponses.push({
      socketId: socket.id,
      text: trimmed
    });

    console.log('Player response recorded', socket.id, trimmed);
  });

  // --- PLAYER TYPING INDICATOR DURING CONVERSATION ---
  socket.on('playerTyping', ({ conversationId, typing }) => {
    // only track typing for the active conversation
    if (!currentConversationId) return;
    if (conversationId !== currentConversationId) return;
    if (!hostSocketId || !hostConnected) return;

    io.to(hostSocketId).emit('playerTyping', {
      conversationId,
      typing: !!typing
    });
  });

  // --- DISCONNECT ---
  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);

    if (socket.data && socket.data.role !== 'host') {
      playerRooms.delete(socket.id);
    }

    if (socket.id === hostSocketId) {
      hostConnected = false;
      hostSocketId  = null;

      // tell players to hide host
      io.emit('hostOffline');

      // if host leaves mid-conversation, end it
      if (currentConversationId) {
        const endedConversationId = currentConversationId;
        clearConversationState();
        io.emit('conversationEnd', { conversationId: endedConversationId });
      }
    }
  });
});

// --- GHOST PLAYER UPDATER ---
// Every few seconds, pick one online player and send its room to the host
setInterval(() => {
  if (!hostConnected || !hostSocketId) return;
  const rooms = Array.from(playerRooms.values());
  if (!rooms.length) return;

  const roomId = rooms[Math.floor(Math.random() * rooms.length)];
  io.to(hostSocketId).emit('ghostPlayerPosition', { roomId });
}, 4000);

// PORT for Render / local
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('room_2 server listening on port ' + PORT);
});
