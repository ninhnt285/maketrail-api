import mongoose, { Schema } from 'mongoose';
import preSave from '../preSave';

const { Types } = mongoose.Schema;

const feedSchema = new Schema(
  {
    _id: Types.ObjectId,
    fromId: String,
    toId: String,
    text: String,
    parentId: String,
    attachments: [String],
    privacy: Number,
    type: Number,
    placeId: String,
    placeName: String,
    story: String
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

feedSchema.pre('save', preSave('FeedType'));

const FeedModel = mongoose.model('Feed', feedSchema);

export default FeedModel;
