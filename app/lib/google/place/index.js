import request from 'request-promise';

import { GOOGLE_API_KEY } from '../../../config';

export async function searchGasStation(lat, lng) {
  try {
    const options = {
      method: 'GET',
      uri: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      qs: {
        key: GOOGLE_API_KEY,
        radius: 5000,
        type: 'gas_station',
        location: `${lat},${lng}`
      },
      encoding: 'utf8'
    };
    const res = JSON.parse(await request(options)
      .then(ggRes => ggRes));
     return res.results;
  } catch (e) {
    console.log(e);
    return [];
  }
}

export async function searchRestaurant(lat, lng) {
  try {
    const options = {
      method: 'GET',
      uri: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      qs: {
        key: GOOGLE_API_KEY,
        radius: 5000,
        type: 'restaurant',
        location: `${lat},${lng}`
      },
      encoding: 'utf8'
    };
    const res = JSON.parse(await request(options)
      .then(ggRes => ggRes));
    return res.results;
  } catch (e) {
    console.log(e);
    return [];
  }
}
