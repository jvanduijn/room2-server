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
    if (socket.data.role !== 'host') return;
    if (!roomId) return;

    hostRoom = roomId;
    socket.broadcast.emit('hostPosition', { roomId: hostRoom });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log('room_2 server listening on http://localhost:' + PORT);
});
