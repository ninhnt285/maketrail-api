/**
 * Created by hoangtran on 6/29/2017.
 */
import AttachmentService from '../../database/helpers/attachment';

const net = require('net');
const clients = {};

export function connect(host, port) {
  try {
    const client = new net.Socket();
    client.connect(port, host, () => {
      console.log('Connected');
    });
    client.on('error', (err) => {
      console.log(err);
      delete clients[host];
    });
    client.on('data', (id) => {
      AttachmentService.loadRenderedVideo(`${id}.mp4`, `http://ren1.maketrail.com/${id}.mp4`);
    });
    clients[host] = client;
  } catch (e) {
    console.log(e);
  }
}

export function write(data) {
  const client = clients['45.32.216.6'];
  try {
    client.write(data);
    client.write('end');
  } catch (e) {
    connect('45.32.216.6', 6969);
  }
}
