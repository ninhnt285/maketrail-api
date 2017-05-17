/**
 * Created by hoangtran on 5/18/2017.
 */
import mongoose, { Schema } from 'mongoose';

const { Types } = mongoose.Schema;

const countrySchema = new Schema(
  {
    name: String,
    parentId: String,
    svgId: String,
    svgFileName: String,
    description: String
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