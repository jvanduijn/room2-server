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

function endConversationAndSendResult(conversationId, reason = 'unknown') {
  // stop the timer (if any)
  if (conversationTimeout) {
    clearTimeout(conversationTimeout);
    conversationTimeout = null;
  }

  console.log('Conversation ending', reason, conversationId);

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
}

io.on('connection', (socket) => {
  console.log('Client connected', socket.id);

  // --- JOIN ---
  socket.on('join', ({ role }) => {
    socket.data.role = role;
    console.log(`Client ${socket.id} joined as ${role}`);

    if (role === 'host') {
      hostSocketId = socket.id;
      socket.emit('initialHostPosition', { roomId: hostRoom });
    } else {
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

    socket.broadcast.emit('hostOnline', { roomId: hostRoom });
  });

  // --- HOST MOVEMENT (blue character) ---
  socket.on('hostMove', ({ roomId }) => {
    if (socket.data.role !== 'host') return;
    if (!roomId) return;

    hostRoom = roomId;
    console.log('Host moved to room:', hostRoom);

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

    socket.broadcast.emit('hostAction', { kind: data.kind });
  });

  // --- CONVERSATION START (host presses "2" first time) ---
  socket.on('startConversation', () => {
    if (socket.data.role !== 'host') return;
    if (currentConversationId) return; // already running

    const conversationId =
      Date.now().toString() + '-' + Math.random().toString(36).slice(2);

    currentConversationId = conversationId;
    conversationResponses = [];

    console.log('Conversation started', conversationId);

    io.emit('conversationStart', { conversationId });

    // fallback timeout (in case host never presses 2 again)
    conversationTimeout = setTimeout(() => {
      // IMPORTANT: only end if still the active one
      if (currentConversationId !== conversationId) return;
      endConversationAndSendResult(conversationId, 'timeout');
    }, CONVERSATION_DURATION_MS);
  });

  // --- CONVERSATION END NOW (host presses "2" second time) ---
  socket.on('endConversationNow', () => {
    if (socket.data.role !== 'host') return;
    if (!currentConversationId) return;

    const conversationId = currentConversationId;
    endConversationAndSendResult(conversationId, 'forced');
  });

  // --- PLAYER MESSAGES DURING CONVERSATION ---
  socket.on('playerMessage', ({ conversationId, text }) => {
    if (!currentConversationId) return;
    if (conversationId !== currentConversationId) return;

    const trimmed = (text || '').toString().slice(0, 120).trim();
    if (!trimmed) return;

    conversationResponses.push({
      socketId: socket.id,
      text: trimmed
    });

    console.log('Player response recorded', socket.id, trimmed);
  });

  // --- PLAYER TYPING INDICATOR DURING CONVERSATION ---
  socket.on('playerTyping', ({ conversationId, typing }) => {
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

      io.emit('hostOffline');

      if (currentConversationId) {
        const endedConversationId = currentConversationId;
        clearConversationState();
        io.emit('conversationEnd', { conversationId: endedConversationId });
      }
    }
  });
});

// --- GHOST PLAYER UPDATER ---
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
