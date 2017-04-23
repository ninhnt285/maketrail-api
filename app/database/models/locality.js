import mongoose, { Schema } from 'mongoose';
import preSave from '../preSave';

const { Types } = mongoose.Schema;

const localitySchema = new Schema(
  {
    _id: Types.ObjectId,
    googlePlaceId: String,
    name: String,
    description: String,
    location: {
      lat: Number,
      lng: Number
    },
    types: [String],
    previewPhotoUrl: String
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

localitySchema.pre('save', preSave('LocalityType'));

const LocalityModel = mongoose.model('Locality', localitySchema);

export default LocalityModel;
