import https from 'https';
import fs from 'fs';
import path from 'path';
import { GOOGLE_API_KEY } from '../../../config';

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

export async function getPhotoFromReference(referenceId, filename) {
  try {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/photo?key=${GOOGLE_API_KEY}&maxheight=400&photoreference=${referenceId}`;
    const result = await downloadFile(apiUrl, path.join(__dirname, `../../../../static/${filename}`));
    return result;
  } catch (e) {
    return null;
  }
}

