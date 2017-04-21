import https from 'https';
import fs from 'fs';
import path from 'path';

export async function getPhotoFromReference(referenceId) {
  const key = 'AIzaSyDMFSsb4IlS2ReTJmI8HNlPmdNAvRwt-7k';
  const apiUrl = `https://maps.googleapis.com/maps/api/place/photo?key=${key}&maxheight=400&photoreference=${referenceId}`;

  const result = await downloadFile(apiUrl, path.join(__dirname, '../../../../static/locality/test.jpg'));
  return result;
}

export function downloadFile(url, dest) {
  const file = fs.createWriteStream(dest);
  return new Promise((resolve, reject) => {
    let responseSent = false;
    https.get(url, (res) => {
      if (res.headers.location) {
        file.close();
        downloadFile(res.headers.location, dest).then((result) => {
          resolve(result);
        });
      } else {
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            if (responseSent) return;
            responseSent = true;
            resolve(dest);
          });
        });
      }
    }).on('error', (e) => {
      if (responseSent) return;
      responseSent = true;
      reject(e);
    });
  });
}
