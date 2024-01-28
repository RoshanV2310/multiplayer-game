const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the public folder
app.use(express.static('public'));

// Store player information
const players = {};

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Initialize player
  players[socket.id] = {
    x: Math.random() * 300,
    y: Math.random() * 300,
  };

  // Broadcast all players' positions to connected player
  io.emit('updatePlayers', players);

  // Handle player movements
  socket.on('move', (data) => {
    players[socket.id].x = data.x;
    players[socket.id].y = data.y;

    // Broadcast the movement to all connected clients
    io.emit('updatePlayers', players);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    delete players[socket.id];
    io.emit('updatePlayers', players);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
