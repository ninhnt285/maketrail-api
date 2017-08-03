/* eslint-disable no-param-reassign */

import MessageService from '../../database/helpers/message';
import { verifyToken } from '../token/';

const usernames = {};

export function createChatServer(server) {
  const io = require('socket.io').listen(server); // eslint-disable-line global-require
  io.sockets.on('connection', (socket) => {
    // when the client access a trip page, this listens and executes
    socket.on('join', async (data) => {
      // store the username in the socket session for this client
      try {
        const user = verifyToken(data.token);
        socket.userId = user.id;
      } catch (e){
        console.log(`Invalid token! ${e}`);
        socket.disconnect();
        return;
      }
      const messages = await MessageService.getMessages(data.tripId, null);
      socket.emit('messages', { messages });
      const lastMessageId = messages.length > 0 ? messages[messages.length-1].id : null;
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
      if (!socket || !socket.room || !socket.userId) return;
      const lastMessageId = usernames[socket.room][socket.userId];
      const messages = await MessageService.getMessages(socket.room, lastMessageId);
      socket.emit('messages', { messages });
    });

    socket.on('chat', async (data) => {
      if (!socket || !socket.room || !socket.userId) return;
      const message = await MessageService.add(socket.room, socket.userId, data);
      io.sockets.in(socket.room).emit('chat', { message });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', () => {
      // remove the username from global usernames list
      if (!socket || !socket.room || !socket.userId) return;
      delete usernames[socket.room][socket.userId];
      // update list of users in chat, client-side
      socket.broadcast.to(socket.room).emit('notify', { from: socket.userId, message: 'has left this room.' });
      io.sockets.in(socket.room).emit('users', { users: Object.keys(usernames[socket.room])});
      socket.leave(socket.room);
    });
  });
}
