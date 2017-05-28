import mongoose, { Schema } from 'mongoose';
import preSave from '../preSave';

const { Types } = mongoose.Schema;

const likeSchema = new Schema(
  {
    _id: Types.ObjectId,
    fromId: String,
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

likeSchema.pre('save', preSave('LikeType'));

const LikeModel = mongoose.model('Like', likeSchema);

export default LikeModel;
