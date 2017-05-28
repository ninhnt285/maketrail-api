import mongoose, { Schema } from 'mongoose';

const { Types } = mongoose.Schema;

const relationSchema = new Schema(
  {
    tripId: String,
    userId: String,
    roleId: Number
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

const UserTripRelationModel = mongoose.model('UserTripRelation', relationSchema);

export default UserTripRelationModel;
