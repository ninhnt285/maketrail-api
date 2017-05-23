import mongoose, { Schema } from 'mongoose';

const { Types } = mongoose.Schema;

const friendshipSchema = new Schema(
  {
    user1: Types.ObjectId,
    user2: Types.ObjectId,
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
