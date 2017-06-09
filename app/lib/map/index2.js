import getPixels from 'get-pixels';
import { exec } from 'child_process';
import path from 'path';

import CountryModel from '../../database/models/country';

function convertGeoToXY(lat, long, oMapInfo) {
  // Declare variables
  const mapWidth = oMapInfo.width;
  const mapHeight = oMapInfo.height;

  const mapLonLeft = oMapInfo.leftLongitude;
  const mapLonRight = oMapInfo.rightLongitude;
  const mapLonDelta = mapLonRight - mapLonLeft;

  const mapLatBottom = oMapInfo.bottomLatitude;
  const mapLatBottomDegree = mapLatBottom * Math.PI / 180;

  // Calculate X, Y
  const x = (long - mapLonLeft) * (mapWidth / mapLonDelta);

  lat = lat * Math.PI / 180;
  const worldMapWidth = ((mapWidth / mapLonDelta) * 360) / (2 * Math.PI);
  const mapOffsetY = (worldMapWidth / 2 * Math.log((1 + Math.sin(mapLatBottomDegree)) / (1 - Math.sin(mapLatBottomDegree))));
  const y = mapHeight - ((worldMapWidth / 2 * Math.log((1 + Math.sin(lat)) / (1 - Math.sin(lat)))) - mapOffsetY);

  return { x, y };
}

export function getPixelColor(x, y, fileName) {
  fileName = path.join(__dirname, '../../../static/maps/png', fileName);
  return new Promise((resolve, reject) => {
    exec(`convert ${fileName}  -crop 1x1+${x}+${y}  txt:-`, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }

      const stdLines = stdout.toString().split('\n');
      const colors = stdLines[1].split(' ');
      let fullColor = '';
      for(let temp of colors) {
        if (temp.indexOf('#') === 0) {
          fullColor = temp;
          break;
        }
      }

      if (fullColor === '') {
        reject('Can not find color!');
      }

      const red = fullColor.substr(1, 2);
      const green = fullColor.substr(5, 2);
      const blue = fullColor.substr(9, 2);

      resolve(`${red}${green}${blue}`.toLowerCase());
    });
  });
}

export async function convertGeoToId(lat, long, parentId) {
  // Find Map File
  let fileName = 'worldHigh.svg';
  // Find width, height; min,max of lat, long of Map File
  let oMapInfo = {
    width: 16820,
    height: 11089,
    leftLongitude: -169.110266,
    topLatitude: 83.63001,
    rightLongitude: 190.480712,
    bottomLatitude: -58.488473
  };


  if (parentId) {
    const country = await CountryModel.findOne({ svgId: parentId }).exec();
    if (!country.hasSvgFile) {
      return false;
    }
    fileName = country.svgFileName;
    oMapInfo = {
      width: country.pngFileWidth,
      height: country.pngFileHeight,
      leftLongitude: country.leftLongitude,
      topLatitude: country.topLatitude,
      rightLongitude: country.rightLongitude,
      bottomLatitude: country.bottomLatitude
    }
  }

  try {
    // Find X, Y from Geo
    const pixelPostion = convertGeoToXY(lat, long, oMapInfo);
    console.log(pixelPostion);

    // Find color in pixel
    const color = await getPixelColor(
      Math.round(pixelPostion.x),
      Math.round(pixelPostion.y),
      fileName.replace('.svg', '.png')
    );
    console.log(color);

    // Find Area from Color
    const query = { markColor: color };
    if (parentId) {
      query['parentId'] = parentId;
    }
    const area = await CountryModel.findOne(query).exec();
    if (area.svgId) {
      return area.svgId;
    }

    return false;
  } catch(err) {
    console.log(err);
    return false;
  }
}
