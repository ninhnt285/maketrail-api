/* eslint-disable no-param-reassign */

import MessageService from '../../database/helpers/message';

const usernames = {};

export function createChatServer(server) {
  const io = require('socket.io').listen(server); // eslint-disable-line global-require
  io.sockets.on('connection', (socket) => {
    // when the client access a trip page, this listens and executes
    socket.on('join', async (data) => {
      const messages = await MessageService.getMessages(data.tripId, null);
      socket.emit('messages', { messages });
      const lastMessageId = messages.length > 0 ? messages[messages.length-1].id : null;
      // store the username in the socket session for this client
      socket.userId = data.userId;
      // store the room name in the socket session for this client
      socket.room = data.tripId;
      // add the client to the global list
      if (!usernames[socket.room]) usernames[socket.room] = {};
      usernames[socket.room][socket.userId] = lastMessageId;
      socket.join(socket.room);
      // notify user connect to room
      socket.broadcast.to(socket.room).emit('notify', { from: socket.userId, message: 'has connected to this room.' });
      io.sockets.in(socket.room).emit('users', { users: Object.keys(usernames[socket.room])});
    });

    socket.on('load', async () => {
      const lastMessageId = usernames[socket.room][socket.userId];
      const messages = await MessageService.getMessages(socket.room, lastMessageId);
      socket.emit('messages', { messages });
    });

    socket.on('chat', async (data) => {
      await MessageService.add(socket.room, socket.userId, data);
      io.sockets.in(socket.room).emit('chat', {from: socket.userId, message: data});
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', () => {
      // remove the username from global usernames list
      if (!socket.room) return;
      delete usernames[socket.room][socket.userId];
      // update list of users in chat, client-side
      socket.broadcast.to(socket.room).emit('notify', { from: socket.userId, message: 'has left this room.' });
      io.sockets.in(socket.room).emit('users', { users: Object.keys(usernames[socket.room])});
      socket.leave(socket.room);
    });
  });
}
