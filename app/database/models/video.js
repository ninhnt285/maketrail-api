import mongoose, { Schema } from 'mongoose';
import preSave from '../preSave';

const { Types } = mongoose.Schema;

const videoSchema = new Schema(
  {
    _id: Types.ObjectId,
    userId: Types.ObjectId,
    caption: String,
    name: String,
    url: String,
    previewUrl: String,
    privacy: Number,
    parentId: Types.ObjectId
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
