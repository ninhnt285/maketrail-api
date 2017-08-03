import mongoose, { Schema } from 'mongoose';

const { Types } = mongoose.Schema;

const friendshipSchema = new Schema(
  {
    user1: String,
    user2: String,
    isFriend: { type: Boolean, default: false },
    isSentRequest: { type: Boolean, default: false },
    isFollow: { type: Boolean, default: false }
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

const FriendshipModel = mongoose.model('Friendship', friendshipSchema);

export default FriendshipModel;
