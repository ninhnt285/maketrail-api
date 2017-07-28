/**
 * Created by hoangtran on 6/29/2017.
 */
import net from 'net';
import AttachmentService from '../../database/helpers/attachment';

const HOST = process.env.NODE_ENV === 'production' ? '45.32.211.12' : 'localhost';
const PORT = '6969';
const clients = {};

export function createRenderServer() {
  net.createServer((sock) => {
    // We have a connection - a socket object is assigned to the connection automatically
    console.log(`CONNECTED: ${sock.remoteAddress}:${sock.remotePort}`);
    clients[sock.remoteAddress] = sock;

    sock.on('data', (data) => {
      try {
        const obj = JSON.parse(data);
        console.log(obj);
        AttachmentService.loadRenderedVideo(obj);
      } catch (e){
        console.log(e);
      }
    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', (data) => {
      console.log(`CLOSED: ${sock.remoteAddress} ${sock.remotePort}`);
      delete clients[sock.remoteAddress];
    });

    sock.on('error', (err) => {
      console.log(`CLOSED: ${err}`);
    });
  }).listen(PORT, HOST);
  console.log(`Server listening on ${HOST}:${PORT}`);
}

function findClient() {
  return clients['45.32.216.6'];
}

export function write(data) {
  const client = findClient();
  try {
    client.write(data);
    client.write('end');
  } catch (e) {
    console.log(e);
  }
}
