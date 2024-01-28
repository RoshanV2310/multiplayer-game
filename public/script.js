const socket = io();

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
  x: Math.random() * 300,
  y: Math.random() * 300,
  size: 20,
};

const otherPlayers = {};

function drawPlayer(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, player.size, player.size);
}

function handleMovement(event) {
  const speed = 5;
  switch (event.key) {
    case 'ArrowUp':
      player.y -= speed;
      break;
    case 'ArrowDown':
      player.y += speed;
      break;
    case 'ArrowLeft':
      player.x -= speed;
      break;
    case 'ArrowRight':
      player.x += speed;
      break;
  }

  // Emit the movement to the server
  socket.emit('move', { x: player.x, y: player.y });
}

document.addEventListener('keydown', handleMovement);

// Listen for other players' movements
socket.on('updatePlayers', (playersData) => {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the current player
  drawPlayer(player.x, player.y, '#00F');

  // Draw other players
  for (const playerId in playersData) {
    const { x, y } = playersData[playerId];
    if (playerId !== socket.id) {
      drawPlayer(x, y, '#F00');
    }
  }
});

// Initial draw
drawPlayer(player.x, player.y, '#00F');
