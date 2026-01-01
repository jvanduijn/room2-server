// server.js
const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: "*" }
});

// Serve index.html and any other files from this same folder
app.use(express.static(__dirname));

// Host state
let hostRoom = 'room2';

// Conversation state
let conversationId = 0;
let conversationMessages = [];
let conversationTimer = null;

io.on('connection', (socket) => {
  console.log('Client connected', socket.id);

  socket.on('join', ({ role }) => {
    socket.data.role = role;
    console.log(`Client ${socket.id} joined as ${role}`);

    // Send current host position to the new client
    socket.emit('hostPosition', { roomId: hostRoom });
    if (role === 'host') {
      socket.emit('initialHostPosition', { roomId: hostRoom });
    }
  });

  // Only the host can move the blue character
  socket.on('hostMove', ({ roomId }) => {
    if (socket.data.role !== 'host') {
      console.log('Ignoring hostMove from non-host client', socket.id);
      return;
    }
    if (!roomId) return;

    hostRoom = roomId;
    console.log('Host moved to room:', hostRoom);
    socket.broadcast.emit('hostPosition', { roomId: hostRoom });
  });

  // Host actions (sleep, shower, tv on, etc.) – broadcast to players
  socket.on('hostAction', ({ kind }) => {
    if (socket.data.role !== 'host') {
      console.log('Ignoring hostAction from non-host client', socket.id);
      return;
    }
    if (!kind) return;
    console.log('Host triggered action:', kind);
    socket.broadcast.emit('hostAction', { kind });
  });

  // Host starts a conversation round (key "2")
  socket.on('startConversation', () => {
    if (socket.data.role !== 'host') {
      console.log('Ignoring startConversation from non-host client', socket.id);
      return;
    }

    conversationId += 1;
    conversationMessages = [];
    if (conversationTimer) clearTimeout(conversationTimer);
    const thisId = conversationId;

    console.log('Conversation started, id =', thisId);

    // Let everyone know a round started
    io.emit('conversationStart', { conversationId: thisId });

    // Give players more time (12s) to react
    conversationTimer = setTimeout(() => {
      // If a new conversation already started, ignore this timer
      if (conversationId !== thisId) return;

      let chosen = null;
      if (conversationMessages.length > 0) {
        const idx = Math.floor(Math.random() * conversationMessages.length);
        chosen = conversationMessages[idx];
      }

      // Send result only to host
      io.to(socket.id).emit('conversationResult', {
        conversationId: thisId,
        message: chosen
      });

      // Let everyone hide their UI
      io.emit('conversationEnd', { conversationId: thisId });
      console.log('Conversation ended, chosen message:', chosen);
    }, 12000); // 12 seconds
  });

  // Player sends a message for the current conversation
  socket.on('playerMessage', ({ conversationId: cid, text }) => {
    if (!text || typeof text !== 'string') return;
    if (!cid || cid !== conversationId) return; // old round, ignore

    const trimmed = text.trim();
    if (!trimmed) return;

    conversationMessages.push(trimmed);
    console.log('Received player message for conversation', cid, ':', trimmed);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

// IMPORTANT for Render: use provided PORT, fallback to 3000 locally
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('room_2 server listening on port ' + PORT);
});
