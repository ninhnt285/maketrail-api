import mongoose, { Schema } from 'mongoose';
import preSave from '../preSave';

const { Types } = mongoose.Schema;

const attachmentSchema = new Schema(
  {
    _id: Types.ObjectId,
    userId: Types.ObjectId,
    caption: String,
    name: String,
    url: String,
    previewUrl: String,
    privacy: Number,
    parentId: Types.ObjectId,
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

attachmentSchema.pre('save', preSave('AttachmentType'));

const AttachmentModel = mongoose.model('Attachment', attachmentSchema);

export default AttachmentModel;
