import fs from 'fs';
import xml2js from 'xml2js';
import gm from 'gm';
import path from 'path';
import request from 'request-promise';
import { GOOGLE_API_KEY } from '../../config';

import CountryModel from '../../database/models/country';

const im = gm.subClass({ imageMagick: true });

function xmlToJson(data) {
  const parser = new xml2js.Parser();
  return new Promise(function(resolve, reject) {
    parser.parseString(data.substring(0, data.length), function(err, json) {
      if (err) {
        reject(err);
      }
      resolve(json);
    });
  });
}

function convertSvgToPng(fileName) {
  return new Promise(function(resolve, reject) {
    im(path.join(__dirname, `../../../static/maps/userSvg/${fileName}`))
      .density(100)
      .trim()
      .write(path.join(__dirname, `../../../static/maps/userPng/${fileName.replace('.svg', '.png')}`), function(err) {
        if (err) {
          reject(err);
        }
        resolve();
      });
  });
}

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

export async function drawUserMap(userId) {
  try {
    /* TODO: Find countries and set color
    * Status:
    * 0: Not visited    #999999
    * 1: Visited        #3c5bdc
    * 2: In a Plan      #330000
    */

    // stroke="#000000" fill-opacity="0.8" stroke-opacity="0.5"
    const countries = {
      'SG': { status: 1 },
      'MY': { status: 1 },
      'US': { status: 1 },
      'VN': { status: 1 }
    };

    // Build SVG File
    let fileData = fs.readFileSync(path.join(__dirname, '../../../static/maps/userSvg/worldHigh.svg'), 'utf8');
    const oSvgData = await xmlToJson(fileData);

    // Add colors to SVG File
    const items = oSvgData.svg.g[0].path;
    for (let itemTemp of items) {
      const item = itemTemp['$'];
      let color = '#999999';
      if (countries[item.id]) {
        if (countries[item.id].status === 1) {
          color = '#3c5bdc';
        } else {
          color = '#330000';
        }
      }

      fileData = fileData.replace(`<path id="${item.id}" `, `<path id="${item.id}" fill="${color}" stroke="#000000" fill-opacity="0.8" stroke-opacity="0.5" `);
    }

    // Save SVG File
    fs.writeFileSync(path.join(__dirname, `../../../static/maps/userSvg/${userId}.svg`), fileData);

    // Convert SVG to PNG
    await convertSvgToPng(`${userId}.svg`);
    console.log('Completed!');

  } catch(err) {
    console.log(err);
    return false;
  }
}
