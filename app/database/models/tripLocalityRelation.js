import mongoose, { Schema } from 'mongoose';
import preSave from '../preSave';

const { Types } = mongoose.Schema;

const relationSchema = new Schema(
  {
    _id: Types.ObjectId,
    tripId: Types.ObjectId,
    localityId: Types.ObjectId,
    arrivalTime: Number
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

relationSchema.pre('save', preSave('TripLocalityType'));
const TripLocalityRelationModel = mongoose.model('TripLocalityRelation', relationSchema);

export default TripLocalityRelationModel;
