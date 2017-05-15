/* eslint-disable global-require */
/**
 * Created by hoangtran on 5/15/2017.
 */
import mongoose, { Schema } from 'mongoose';
import connectDb from '../database/connectDb';

const { Types } = mongoose.Schema;

const countrySchema = new Schema(
  {
    name: String,
    alpha2: String,
    alpha3: String,
    description: String
  }, {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);

const CountryModel = mongoose.model('Country', countrySchema);

function construct(array){
  return {
    name: array[0],
    alpha2: array[1],
    alpha3: array[2]
  };
}

async function onConnected() {
  const docs = [];
  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./countries.txt')
  });

  lineReader.on('line', async function (line) {
    docs.push(construct(line.split('\t')));
  });

  lineReader.on('close', function () {
    console.log(docs.length);
    CountryModel.remove({}, function (err){
      console.log(err);
    });
    CountryModel.insertMany(docs, function (err){
      console.log(err);
    });
  });
}

connectDb(onConnected);

