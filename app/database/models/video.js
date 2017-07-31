import mongoose, { Schema } from 'mongoose';
import preSave from '../preSave';

const { Types } = mongoose.Schema;

const videoSchema = new Schema(
  {
    _id: Types.ObjectId,
    fromId: String,
    caption: String,
    name: String,
    url: String,
    previewUrl: String,
    privacy: Number,
    userId: String,
    parentId: String,
    placeId: String,
    placeName: String,
    isProcessing: Boolean
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

videoSchema.pre('save', preSave('VideoType'));

const VideoModel = mongoose.model('Video', videoSchema);

export default VideoModel;
