import mongoose, { Schema } from 'mongoose';
import preSave from '../preSave';

const { Types } = mongoose.Schema;

const commentSchema = new Schema(
  {
    _id: Types.ObjectId,
    fromId: String,
    parentId: String,
    text: String
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

commentSchema.pre('save', preSave('CommentType'));

const CommentModel = mongoose.model('Comment', commentSchema);

export default CommentModel;
