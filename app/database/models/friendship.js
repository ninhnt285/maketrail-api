import mongoose, { Schema } from 'mongoose';

const { Types } = mongoose.Schema;

const friendshipSchema = new Schema(
  {
    user1: String,
    user2: String,
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
