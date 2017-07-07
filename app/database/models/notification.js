import mongoose, { Schema } from 'mongoose';
import preSave from '../preSave';

const { Types } = mongoose.Schema;

const notificationSchema = new Schema(
  {
    _id: Types.ObjectId,
    userId: String,
    fromId: String,
    toId: String,
    sourceId: String,
    type: String,
    isRead: Boolean
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

notificationSchema.pre('save', preSave('NotificationType'));

const NotificationModel = mongoose.model('Notification', notificationSchema);

export default NotificationModel;
