/* eslint-disable global-require */
/**
 * Created by hoangtran on 5/15/2017.
 */
import fs from 'fs';
import parser from 'xml2json';
import connectDb from '../database/connectDb';
import CountryModel from '../database/models/country';

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => index === 0 ? letter.toLowerCase() : letter.toUpperCase()).replace(/\s+/g, '');
}

async function onConnected() {
  await CountryModel.remove({});
  fs.readFile('./static/maps/svg/worldHigh.svg', (err, data) => {
    const json = parser.toJson(data);
    const items = JSON.parse(json).svg.g.path;
    let itemsProcessed = items.length;
    items.forEach(async (item) => {
      let svgFileName = camelize(item.title);
      if (svgFileName === 'unitedStates') {
        svgFileName = 'usa';
      }
      svgFileName += 'High.svg';
      const tmp = await CountryModel.create({ name: item.title, svgId: item.id, svgFileName });
      console.log(tmp.svgFileName);
      fs.readFile(`./static/maps/svg/${tmp.svgFileName}`, (err2, data2) => {
        if (!err2) {
          const json2 = parser.toJson(data2);
          const items2 = JSON.parse(json2).svg.g.path;
          if (Array.isArray(items2)) {
            items2.forEach(async (item2) => {
              await CountryModel.create({ name: item2.title, svgId: item2.id, parentId: tmp.svgId });
            });
          } else {
            CountryModel.create({ name: items2.title, svgId: items2.id, parentId: tmp.id }, (err, data) => {
            });
          }
        }
      });
      console.log(`done : ${tmp.svgFileName}`);
      itemsProcessed -= 1;
      if (itemsProcessed === 0) {
        console.log('all done');
      }
    });
  });
}

connectDb(onConnected);

