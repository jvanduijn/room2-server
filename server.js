// server.js
const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: "*" }
});

// Serve index.html + assets from this folder
app.use(express.static(__dirname));

// --- HOST STATE ---
let hostRoom       = 'room5';   // spawn in living room
let hostConnected  = false;
let hostSocketId   = null;

// --- CONVERSATION STATE (for the "2" key feature) ---
let currentConversationId = null;
let conversationResponses = [];
let conversationTimeout   = null;

// 8–9 seconds window for players to respond
const CONVERSATION_DURATION_MS = 9000;

// Helper: reset conversation state
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
      hostConnected = true;
      hostSocketId  = socket.id;

      // Send initial position just to the host
      socket.emit('initialHostPosition', { roomId: hostRoom });
    } else {
      // Player: only show host if a host is actually connected
      if (hostConnected) {
        socket.emit('hostPosition', { roomId: hostRoom });
      }
    }
  });

  // --- HOST MOVEMENT (blue character) ---
  socket.on('hostMove', ({ roomId }) => {
    if (socket.data.role !== 'host') return;
    if (!roomId) return;

    hostRoom = roomId;
    console.log('Host moved to room:', hostRoom);

    // Broadcast to all other clients (players)
    socket.broadcast.emit('hostPosition', { roomId: hostRoom });
  });

  // --- HOST ACTIONS (sleep, shower, tv on/off, etc) ---
  socket.on('hostAction', (data) => {
    if (socket.data.role !== 'host') return;
    if (!data || !data.kind) return;

    // Broadcast to everyone else (players) so they see the popup
    socket.broadcast.emit('hostAction', { kind: data.kind });
  });

  // --- CONVERSATION START (host presses "2") ---
  socket.on('startConversation', () => {
    if (socket.data.role !== 'host') return;

    // Only one conversation at a time
    if (currentConversationId) return;

    // New conversation id
    const conversationId =
      Date.now().toString() + '-' + Math.random().toString(36).slice(2);

    currentConversationId = conversationId;
    conversationResponses = [];

    console.log('Conversation started', conversationId);

    // Notify all clients (host + players)
    io.emit('conversationStart', { conversationId });

    // After a timeout, pick one response (if any) and show it to host
    conversationTimeout = setTimeout(() => {
      console.log('Conversation ending', conversationId);

      let chosenMessage = null;
      if (conversationResponses.length > 0) {
        const idx = Math.floor(Math.random() * conversationResponses.length);
        chosenMessage = conversationResponses[idx].text;
      }

      // Send chosen response only to host
      if (hostSocketId && hostConnected) {
        io.to(hostSocketId).emit('conversationResult', {
          conversationId,
          message: chosenMessage || null
        });
      }

      // Notify everyone that this conversation round ended
      io.emit('conversationEnd', { conversationId });

      // Reset state
      clearConversationState();
    }, CONVERSATION_DURATION_MS);
  });

  // --- PLAYER MESSAGES (during conversation) ---
  socket.on('playerMessage', ({ conversationId, text }) => {
    // Only players should send this, but we don't strictly enforce role here
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

  // --- DISCONNECT ---
  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);

    // If the host disconnects, mark offline + end conversation if active
    if (socket.id === hostSocketId) {
      hostConnected = false;
      hostSocketId  = null;

      // Let players hide the host
      io.emit('hostOffline');

      // If host leaves mid-conversation, end it for players
      if (currentConversationId) {
        const endedConversationId = currentConversationId;

        clearConversationState();

        io.emit('conversationEnd', {
          conversationId: endedConversationId
        });
      }
    }
  });
});

// IMPORTANT for Render / local
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('room_2 server listening on port ' + PORT);
});
