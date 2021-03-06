import mongoose, { Schema } from 'mongoose';
import preSave from '../preSave';

const { Types } = mongoose.Schema;

const relationSchema = new Schema(
  {
    _id: Types.ObjectId,
    tripId: String,
    localityId: String,
    arrivalTime: Number,
    weather: {
      icon: String
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

relationSchema.pre('save', preSave('TripLocalityType'));
const TripLocalityRelationModel = mongoose.model('TripLocalityRelation', relationSchema);

export default TripLocalityRelationModel;
