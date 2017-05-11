import mongoose, { Schema } from 'mongoose';
import preSave from '../preSave';

const { Types } = mongoose.Schema;

const feedSchema = new Schema(
  {
    _id: Types.ObjectId,
    userId: Types.ObjectId,
    objectId: Types.ObjectId,
    content: {
      text: String,
      attachments: [Types.ObjectId]
    },
    privacy: Number,
    type: Number
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
