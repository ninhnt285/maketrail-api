import https from 'https';
import http from 'http';
import request from 'request-promise';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import mkdirp from 'mkdirp';
const CronJob = require('cron').CronJob;

import { GOOGLE_API_KEY, FOURSQUARE_TOKEN } from '../../../config';

const dimens = [
  {
    name: '50_square',
    size: [50, 50]
  },
  {
    name: '150_square',
    size: [150, 150]
  },
  {
    name: '250',
    size: [250, null]
  },
  {
    name: '500_square',
    size: [500, 500]
  },
  {
    name: '500',
    size: [500, null]
  },
  {
    name: '1000',
    size: [1000, null]
  },
];

export async function resize(filename, force = false) {
  const photo = path.join(__dirname, `../../../../static/${filename}`);
  const f = photo.split('.');
  dimens.forEach((dimen) => {
    const fpath = `${f[0]}_${dimen.name}.${f[1]}`;
    if (force || !fs.existsSync(fpath)) {
      sharp(photo).resize(dimen.size[0], dimen.size[1]).toFile(fpath, null);
    }
  });
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

export function downloadFileHttp(url, dest) {
  const file = fs.createWriteStream(dest);
  return new Promise((resolve, reject) => {
    let responseSent = false;
    http.get(url, (res) => {
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
    if (!referenceId) return false;
    const apiUrl = `https://maps.googleapis.com/maps/api/place/photo?key=${GOOGLE_API_KEY}&maxheight=1600&photoreference=${referenceId}`;
    const dest = path.join(__dirname, `../../../../static/${filename}`);
    await downloadFile(apiUrl, dest);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function getPhotoFromPlaceId(placeId, filename) {
  const options = {
    method: 'GET',
    uri: 'https://maps.googleapis.com/maps/api/place/details/json',
    qs: {
      key: GOOGLE_API_KEY,
      placeid: placeId
    },
    encoding: 'utf8'
  };
  const res = JSON.parse(await request(options)
    .then(ggRes => ggRes));
  const locality = res.result;
  if (locality.photos && locality.photos.length > 0) {
    getPhotoFromReference(locality.photos[0].photo_reference, filename);
  }
}

export async function getPhotoFromFoursquareId(foursquareId, filename) {
  try {
    if (!foursquareId) return false;
    const options = {
      method: 'GET',
      uri: `https://api.foursquare.com/v2/venues/${foursquareId}/photos`,
      qs: {
        oauth_token: FOURSQUARE_TOKEN,
        v: '20170428',
        limit: 1,
      },
      encoding: 'utf8'
    };
    const res = JSON.parse(await request(options)
      .then(ggRes => ggRes));
    if (res.response.photos.items.length === 0) {
      console.log(`Cannot found image ${foursquareId}`);
      return false;
    }
    const prefix = res.response.photos.items[0].prefix;
    const suffix = res.response.photos.items[0].suffix;
    const apiUrl = `${prefix}original${suffix}`;
    const dest = path.join(__dirname, `../../../../static/${filename}`);
    await downloadFile(apiUrl, dest);
    return true;
  } catch (e) {
    console.log(e);
    console.log(`Cannot found image ${foursquareId}`);
    return false;
  }
}

const makeDir = function () {
  const date = new Date();
  const dir = path.join(__dirname, `../../../../static/locality/${date.getUTCFullYear()}/${(date.getUTCMonth() + 1)}`);
  const dir2 = path.join(__dirname, `../../../../static/venue/${date.getUTCFullYear()}/${(date.getUTCMonth() + 1)}`);
  const dir3 = path.join(__dirname, `../../../../static/photo/${date.getUTCFullYear()}/${(date.getUTCMonth() + 1)}`);
  const dir4 = path.join(__dirname, `../../../../static/video/${date.getUTCFullYear()}/${(date.getUTCMonth() + 1)}`);
  mkdirp(dir, (err) => {
    if (err) console.log(err);
  });
  mkdirp(dir2, (err) => {
    if (err) console.log(err);
  });
  mkdirp(dir3, (err) => {
    if (err) console.log(err);
  });
  mkdirp(dir4, (err) => {
    if (err) console.log(err);
  });
};

export function prepareDir() {
  makeDir();
  new CronJob('0 0 0 1 * *', makeDir, null, true, null);
}

