import mongoose, { Schema } from 'mongoose';
import preSave from '../preSave';

const { Types } = mongoose.Schema;

const photoSchema = new Schema(
  {
    _id: Types.ObjectId,
    fromId: String,
    caption: String,
    name: String,
    url: String,
    previewUrl: String,
    privacy: Number,
    parentId: String
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

photoSchema.pre('save', preSave('PhotoType'));

const PhotoModel = mongoose.model('Photo', photoSchema);

export default PhotoModel;
