import mongoose, { Schema } from 'mongoose';
import preSave from '../preSave';

const { Types } = mongoose.Schema;

const venueSchema = new Schema(
  {
    _id: Types.ObjectId,
    foursquareId: String,
    name: String,
    address: String,
    location: {
      lat: Number,
      lng: Number
    },
    phone: String,
    rating: Number,
    openHours: String,
    price: Number,
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

venueSchema.pre('save', preSave('VenueType'));

const VenueModel = mongoose.model('Venue', venueSchema);

export default VenueModel;
