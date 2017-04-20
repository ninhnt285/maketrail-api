import mongoose, { Schema } from 'mongoose';

const { Types } = mongoose.Schema;

const relationSchema = new Schema(
  {
    tripId: Types.ObjectId,
    localityId: Types.ObjectId,
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

const TripLocalityRelationModel = mongoose.model('TripLocalityRelation', relationSchema);

export default TripLocalityRelationModel;
