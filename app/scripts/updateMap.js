import fs from 'fs';
import xml2js from 'xml2js';
import gm from 'gm';
import connectDb from '../database/connectDb';
import CountryModel from '../database/models/country';

const im = gm.subClass({ imageMagick: true });

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => index === 0 ? letter.toLowerCase() : letter.toUpperCase()).replace(/\s+/g, '');
}

// Define all Promises
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

function identifyImage(filePath) {
  return new Promise(function(resolve, reject) {
    im(filePath)
      .identify(function(err, value) {
        if (err) {
          reject(err);
        }
        resolve(value);
      });
  });
}

function convertSvgToPng(fileName) {
  return new Promise(function(resolve, reject) {
    let density = '400';
    if (fileName === 'worldHigh.svg') {
      density = '1600';
    }

    im(`./static/maps/svg2/${fileName}`)
      .density(density)
      .trim()
      .write(`./static/maps/png/${fileName.replace('.svg', '.png')}`, function(err) {
        if (err) {
          reject(err);
        }
        resolve();
      });
  });
}

// Generate Random Color
function randomColor(existedColors) {
  let red = Math.floor((Math.random() * 256)).toString(16);
  red = (red.length === 1 ? `0${red}` : red);
  let green = Math.floor((Math.random() * 256)).toString(16);
  green = (green.length === 1 ? `0${green}` : green);
  let blue = Math.floor((Math.random() * 256)).toString(16);
  blue = (blue.length === 1 ? `0${blue}` : blue);
  const color = `${red}${green}${blue}`;

  if (existedColors.indexOf(color) !== -1) {
    return randomColor(existedColors);
  }
  return color;
}

async function processSvgFile(fileName, svgId) {
  try {
    console.log(`Processing file: ${fileName} with ID ${svgId}`);
    let fileData = fs.readFileSync(`./static/maps/svg/${fileName}`, 'utf8');

    // convert SVG Data to JSON
    const colors = [];
    const oSvgData = await xmlToJson(fileData);

    // Set width, height for svg
    if (fileName === 'worldHigh.svg') {
      fileData = fileData.replace('<svg ', '<svg width="1000" height="1000" ');
    } else {
      fileData = fileData.replace('<svg ', '<svg width="5000" height="5000" ');
    }

    // Add markColor for each item and save in database
    const items = oSvgData.svg.g[0].path;
    for (let itemTemp of items) {
      const item = itemTemp['$'];
      const color = randomColor(colors);
      colors.push(color);
      fileData = fileData.replace(`<path id="${item.id}" `, `<path id="${item.id}" fill="#${color}" `);
      await CountryModel.findOneAndUpdate({ svgId: item.id }, { $set: { markColor: color, hasSvgFile: null }}).exec();
    }

    // Find and save lat, long data
    if (svgId) {
      const oAmmapData = oSvgData.svg.defs[0]['amcharts:ammap'][0]['$'];
      await CountryModel.findOneAndUpdate(
        { svgId: svgId },
        { $set: {
          hasSvgFile: true,
          leftLongitude: oAmmapData.leftLongitude,
          topLatitude: oAmmapData.topLatitude,
          rightLongitude: oAmmapData.rightLongitude,
          bottomLatitude: oAmmapData.bottomLatitude
        }}
      ).exec();
      console.log('Saved Ammap Data');
    }

    // Save new svg file
    fs.writeFileSync(`./static/maps/svg2/${fileName}`, fileData);
    console.log('Saved new SVG with new color');

    // Export svg to png
    await convertSvgToPng(fileName);
    console.log(`Converted to ${fileName.replace('.svg', '.png')}`);

    // Find and save image size
    if (svgId) {
      const oImageInfo = await identifyImage(`./static/maps/png/${fileName.replace('.svg', '.png')}`);
      await CountryModel.findOneAndUpdate(
        { svgId: svgId },
        { $set: {
          pngFileWidth: oImageInfo.size.width,
          pngFileHeight: oImageInfo.size.height
        }}
      ).exec();
      console.log('Saved PNG Image Size');
    }
  } catch(err) {
    await CountryModel.findOneAndUpdate(
      { svgId: svgId },
      { $set: {
        hasSvgFile: false
      }}
    ).exec();
    console.log('File not existed!');
  }
  console.log('---------------------');
}

async function onConnected() {
  await processSvgFile('worldHigh.svg');

  // Process all countries
  const countries = await CountryModel.find({ parentId: null }).exec();
  for (let country of countries) {
    await processSvgFile(country.svgFileName, country.svgId);
  }

  console.log('Complete all SVG files');
}

connectDb(onConnected);
