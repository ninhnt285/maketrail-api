import connectDb from '../database/connectDb';
import { convertGeoToId, getPixelColor } from '../lib/map';

async function onConnected() {
  // let areaSvgId = await convertGeoToId(20.192269, 105.928889);
  // console.log(areaSvgId);
  // console.log('-----');
  // areaSvgId = await convertGeoToId(20.192269, 105.928889, 'VN');
  // console.log(areaSvgId);
  // console.log('-----');
  //
  // areaSvgId = await convertGeoToId(1.377526, 103.997360);
  // console.log(areaSvgId);
  // console.log('-----');
  //
  // areaSvgId = await convertGeoToId(-53.078850, 73.580934);
  // console.log(areaSvgId);
  // console.log('-----');


  let color = await getPixelColor(11352, 10638, 'worldHigh.png');
  console.log(color);
  color = await getPixelColor(11351, 10637, 'worldHigh.png');
  console.log(color);
  color = await getPixelColor(11350, 10636, 'worldHigh.png');
  console.log(color);
}

connectDb(onConnected);
