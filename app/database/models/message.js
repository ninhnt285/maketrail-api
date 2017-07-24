import mongoose, { Schema } from 'mongoose';

const { Types } = mongoose.Schema;

const messageSchema = new Schema(
  {
    tripId: String,
    fromId: String,
    message: String
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

const MessageModel = mongoose.model('Message', messageSchema);

export default MessageModel;
