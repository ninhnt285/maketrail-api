import connectDb from '../database/connectDb';
import { convertGeoToId, drawUserMap } from '../lib/map';

async function onConnected() {
  // // Ninh Bình, Vietnam - VN
  // let areaSvgId = await convertGeoToId(20.192269, 105.928889);
  // console.log(areaSvgId);
  // console.log('-----');
  // areaSvgId = await convertGeoToId(20.192269, 105.928889, 'VN');
  // console.log(areaSvgId);
  // console.log('-----');
  //
  // // Singapore - SG
  // areaSvgId = await convertGeoToId(1.377526, 103.997360);
  // console.log(areaSvgId);
  // console.log('-----');
  //
  // // Heard Island and McDonald Islands - HM
  // areaSvgId = await convertGeoToId(-53.078850, 73.580934);
  // console.log(areaSvgId);
  // console.log('-----');
  //
  // // North Carolina, USA - NC, US
  // areaSvgId = await convertGeoToId(35.721562,-76.891129);
  // console.log(areaSvgId);
  // console.log('-----');

  // Draw User Map
  await drawUserMap('12345');
}

connectDb(onConnected);
