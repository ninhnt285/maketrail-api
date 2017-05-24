import mongoose, { Schema } from 'mongoose';

const { Types } = mongoose.Schema;

const notificationSchema = new Schema(
  {
    fromId: Types.ObjectId,
    toId: Types.ObjectId,
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

const NotificationModel = mongoose.model('Notification', notificationSchema);

export default NotificationModel;
