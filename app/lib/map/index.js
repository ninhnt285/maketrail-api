import request from 'request-promise';
import { GOOGLE_API_KEY } from '../../config';

import CountryModel from '../../database/models/country';

export async function convertGeoToId(lat, long) {
  try {
    const options = {
      method: 'GET',
      uri: 'https://maps.googleapis.com/maps/api/geocode/json',
      qs: {
        key: GOOGLE_API_KEY,
        latlng: `${lat},${long}`
      },
      encoding: 'utf8'
    };
    const res = JSON.parse(await request(options)
      .then(ggRes => ggRes));
    const locations = res.results;
    if (locations.length == 0) {
      return false;
    }

    let svgIds = [];
    for(let location of locations[0].address_components) {
      if (location.types.indexOf('country') !== -1) {
        svgIds.push(location.short_name);
      }

      if (location.types.indexOf('administrative_area_level_1') !== -1) {
        const area = await CountryModel.findOne({ name: location.long_name }).exec();
        if (area) {
          svgIds.push(area.svgId);
        }
      }
    }

    if (svgIds.length === 0) {
      return false;
    }

    return svgIds;
  } catch(err) {
    console.log(err);
    return false;
  }
}
