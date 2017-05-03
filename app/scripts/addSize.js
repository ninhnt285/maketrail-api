import fs from 'fs';
import path from 'path';
import { resize, getPhotoFromPlaceId } from '../lib/google/place/photo';
import connectDb from '../database/connectDb';
import LocalityModel from '../database/models/locality';
import VenueModel from '../database/models/venue';

export function getFileSize(uri) {
  const photo = path.join(__dirname, `/../../static/${uri}`);
  const stats = fs.statSync(photo);
  return stats.size;
}

async function onConnected() {
  const localities = await LocalityModel.find({});
  localities.forEach(async (locality) => {
    if (locality.previewPhotoUrl) {
      const photoUri = locality.previewPhotoUrl.replace('%s', '');
      if (getFileSize(photoUri) < 4040) {
        await getPhotoFromPlaceId(locality.googlePlaceId, photoUri);
        await resize(photoUri, true);
      } else {
        await resize(photoUri);
      }
    }
  });
  const venues = await VenueModel.find({});
  venues.forEach(async (venue) => {
    if (venue.previewPhotoUrl) {
      const photoUri = venue.previewPhotoUrl.replace('%s', '');
      await resize(photoUri);
    }
  });
  console.log('done');
}

connectDb(onConnected);
