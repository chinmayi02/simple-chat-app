const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the "public" directory
app.use(express.static('public'));

// Store connected users
const users = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle new user joining the chat
  socket.on('join', (username) => {
    users[socket.id] = username;
    socket.broadcast.emit('user joined', username);
  });

  // Handle incoming messages
  socket.on('chat message', (message) => {
    const username = users[socket.id];
    io.emit('chat message', { username, message });
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    const username = users[socket.id];
    delete users[socket.id];
    socket.broadcast.emit('user left', username);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
