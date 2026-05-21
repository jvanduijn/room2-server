// server.js
const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: "*" }
});

// clean host URL: /host
app.get('/host', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname));

// --- HOST STATE ---
let hostRoom      = 'room5';
let hostConnected = false;
let hostSocketId  = null;

// --- PLAYER STATE ---
const playerRooms = new Map();

// --- CONVERSATION STATE ---
let currentConversationId = null;
let conversationResponses = [];
let conversationHostId    = null;

function clearConversationState() {
  currentConversationId = null;
  conversationResponses = [];
  conversationHostId = null;
}

function pickRandomResponseOrNull() {
  if (!conversationResponses.length) return null;
  const idx = Math.floor(Math.random() * conversationResponses.length);
  return conversationResponses[idx].text || null;
}

io.on('connection', (socket) => {
  console.log('Client connected', socket.id);

  // --- MAX/MSP BRIDGE ---
  socket.on('maxTrigger', (data) => {
    console.log('maxTrigger:', data);
    io.emit('maxTrigger', data);
  });

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

      if (hostSocketId && hostConnected) {
        io.to(hostSocketId).emit('playerJoined', {
          socketId: socket.id
        });
      }
    }
  });

  // --- PLAYER POKES HOST ---
  socket.on('pokeHost', (data) => {
    if (socket.data.role === 'host') return;
    if (!hostSocketId || !hostConnected) return;

    io.to(hostSocketId).emit('pokeHost', {
      from: socket.id,
      roomId: data && data.roomId ? data.roomId : null
    });
  });

  socket.on('hostReady', () => {
    if (socket.id !== hostSocketId) return;
    hostConnected = true;
    console.log('Host is now ready/online');
    socket.broadcast.emit('hostOnline', { roomId: hostRoom });
  });

  socket.on('hostMove', ({ roomId }) => {
    if (socket.data.role !== 'host') return;
    if (!roomId) return;

    hostRoom = roomId;
    socket.broadcast.emit('hostPosition', { roomId: hostRoom });
  });

  socket.on('playerMove', ({ roomId }) => {
    if (socket.data.role === 'host') return;
    if (!roomId) return;
    playerRooms.set(socket.id, roomId);
  });

  socket.on('hostAction', (data) => {
    if (socket.data.role !== 'host') return;
    if (!data || !data.kind) return;
    socket.broadcast.emit('hostAction', { kind: data.kind });
  });

  socket.on('startConversation', () => {
    if (socket.data.role !== 'host') return;
    if (currentConversationId) return;

    const conversationId =
      Date.now().toString() + '-' + Math.random().toString(36).slice(2);

    currentConversationId = conversationId;
    conversationResponses = [];
    conversationHostId = socket.id;

    console.log('Conversation started', conversationId);
    io.emit('conversationStart', { conversationId });
  });

  socket.on('endConversation', () => {
    if (socket.data.role !== 'host') return;
    if (!currentConversationId) return;

    const conversationId = currentConversationId;
    const chosen = pickRandomResponseOrNull();
    const message = chosen && String(chosen).trim()
      ? String(chosen)
      : 'no response..';

    io.emit('conversationResult', { conversationId, message });
    io.emit('conversationEnd', { conversationId });

    clearConversationState();
  });

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

  socket.on('playerTyping', ({ conversationId, typing }) => {
    if (!currentConversationId) return;
    if (conversationId !== currentConversationId) return;
    if (!hostSocketId || !hostConnected) return;

    io.to(hostSocketId).emit('playerTyping', {
      conversationId,
      typing: !!typing
    });
  });

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

// PORT
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('room_2 server listening on port ' + PORT);
});
