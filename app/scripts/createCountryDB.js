/* eslint-disable global-require */
/**
 * Created by hoangtran on 5/15/2017.
 */
import fs from 'fs';
import xml2js from 'xml2js';
import connectDb from '../database/connectDb';
import CountryModel from '../database/models/country';

const specialFiles = {
  'antiguaAndBarbuda': 'antiguaBarbuda',
  'bosniaAndHerzegovina': 'bosniaHerzegovinaCantons',
  'cocos(Keeling)Islands': 'cocosIslands',
  'democraticRepublicOfCongo': 'congoDR',
  'republicOfCongo': 'congo',
  'westernSahara': 'moroccoWesternSahara',
  'fiji': 'fijiWest',
  'federatedStatesOfMicronesia': 'micronesia',
  'southGeorgiaAndSouthSandwichIslands': 'georgiaSouthOssetia',
  'guinea-Bissau': 'guineaBissau',
  'saintKittsAndNevis': 'stKittsNevis',
  'saintLucia': 'stLucia',
  'macau': 'macao',
  'saintPierreAndMiquelon': 'saintPierreMiquelon',
  'saintHelena': 'stHelena',
  'svalbardAndJanMayen': 'svalbardJanMayen',
  'unitedStates': 'usaMercator',
  'saintVincentAndTheGrenadines': 'stVincent',
  'wallisAndFutuna': 'wallisFutuna'
};

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => index === 0 ? letter.toLowerCase() : letter.toUpperCase()).replace(/\s+/g, '');
}

async function onConnected() {
  await CountryModel.remove({});

  fs.readFile('./static/maps/svg/worldHigh.svg', 'utf8', (err, data) => {
    const parser = new xml2js.Parser();
    parser.parseString(data.substring(0, data.length), function (err2, result) {
      const items = result.svg.g[0].path;
      let itemsProcessed = items.length;
      items.forEach(async (itemTemp) => {
        const item = itemTemp['$'];
        let svgFileName = camelize(item.title);
        if (specialFiles[svgFileName]) {
          svgFileName = specialFiles[svgFileName];
        }

        svgFileName += 'High.svg';
        const tmp = await CountryModel.create({ name: item.title, svgId: item.id, svgFileName });
        console.log(tmp.svgFileName);
        fs.readFile(`./static/maps/svg/${tmp.svgFileName}`, 'utf8', (err3, data2) => {
          if (!err3) {
            let parser2 = new xml2js.Parser();
            parser2.parseString(data2.substring(0, data2.length), function (err4, result2) {
              const items2 = result2.svg.g[0].path;
              if (Array.isArray(items2)) {
                items2.forEach(async (itemTemp2) => {
                  const item2 = itemTemp2['$'];
                  await CountryModel.create({ name: item2.title, svgId: item2.id, parentId: tmp.svgId });
                });
              } else {
                CountryModel.create({ name: items2.title, svgId: items2.id, parentId: tmp.svgId }, (err, data) => {
                });
              }
            });
          }
        });
        console.log(`done : ${tmp.svgFileName}`);
        itemsProcessed -= 1;
        if (itemsProcessed === 0) {
          console.log('all done');
        }
      });
    });
  });
}

connectDb(onConnected);
