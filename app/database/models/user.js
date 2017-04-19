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
    facebook: {
      id: String,
      token: String,
      email: String,
      name: String
    },
    google: {
      id: String,
      token: String,
      email: String,
      name: String
    },
    twitter: {
      id: String,
      token: String,
      email: String,
      name: String
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
