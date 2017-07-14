import mongoose, { Schema } from 'mongoose';
import preSave from '../preSave';

const { Types } = mongoose.Schema;

const userSchema = new Schema(
  {
    _id: Types.ObjectId,
    username: String,
    email: String,
    fullName: String,
    profilePicUrl: String,
    password: String,
    setting: {
      allowTripInvite: { type: Number, default: 0 } // 0: anyone 1: following 2: noone
    },
    facebook: {
      id: String,
      token: String,
      email: String,
      name: String,
      username: String
    },
    google: {
      id: String,
      token: String,
      email: String,
      name: String,
      username: String
    },
    twitter: {
      id: String,
      token: String,
      tokenSecret: String,
      email: String,
      name: String,
      username: String
    }
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

userSchema.pre('save', preSave('UserType'));

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
