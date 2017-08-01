import mongoose, { Schema } from 'mongoose';
import preSave from '../preSave';

const { Types } = mongoose.Schema;

const notificationSchema = new Schema(
  {
    _id: Types.ObjectId,
    userId: String, // user receive notify
    fromId: String, // subject make notification
    toId: String, // affected object
    sourceId: String, // action detail
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
