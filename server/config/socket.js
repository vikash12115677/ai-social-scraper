const logger = require('./logger');

let io;

const initSocket = (socketIo) => {
  io = socketIo;

  io.on('connection', (socket) => {
    logger.info(`🔌 Client connected: ${socket.id}`);

    socket.on('join-dashboard', (userId) => {
      socket.join(`user-${userId}`);
      logger.info(`User ${userId} joined dashboard room`);
    });

    socket.on('disconnect', () => {
      logger.info(`🔌 Client disconnected: ${socket.id}`);
    });
  });
};

const emitNewPosts = (posts) => {
  if (io) {
    io.emit('new-posts', { posts, count: posts.length, timestamp: new Date() });
  }
};

const emitNotification = (userId, notification) => {
  if (io) {
    io.to(`user-${userId}`).emit('notification', notification);
  }
};

const emitScrapeStatus = (status) => {
  if (io) {
    io.emit('scrape-status', status);
  }
};

module.exports = { initSocket, emitNewPosts, emitNotification, emitScrapeStatus };
