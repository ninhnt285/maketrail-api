import mongoose, { Schema } from 'mongoose';

const { Types } = mongoose.Schema;

const relationSchema = new Schema(
  {
    tripId: Types.ObjectId,
    userId: Types.ObjectId,
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
