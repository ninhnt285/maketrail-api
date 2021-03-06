import mongoose, { Schema } from 'mongoose';
import preSave from '../preSave';

const { Types } = mongoose.Schema;

const tripSchema = new Schema(
  {
    _id: Types.ObjectId,
    name: String,
    exportedVideo: Boolean,
    exporter: String,
    privacy: Number,
    userId: String,
    previewPhotoUrl: String,
    isPublished: Boolean,
    recentExportedVideo: String
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

tripSchema.pre('save', preSave('TripType'));

const TripModel = mongoose.model('Trip', tripSchema);

export default TripModel;
