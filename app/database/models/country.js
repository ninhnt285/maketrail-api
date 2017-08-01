/**
 * Created by hoangtran on 5/18/2017.
 */
import mongoose, { Schema } from 'mongoose';

const { Types } = mongoose.Schema;

const countrySchema = new Schema(
  {
    name: String,
    parentId: String,
    children: Number,
    svgId: String,
    svgFileName: String,
    description: String,

    markColor: String,
    hasSvgFile: Boolean,
    pngFileWidth: Number,
    pngFileHeight: Number,
    leftLongitude: Number,
    topLatitude: Number,
    rightLongitude: Number,
    bottomLatitude: Number
  }, {
    timestamps: true,
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);

const CountryModel = mongoose.model('Country', countrySchema);

export default CountryModel;
