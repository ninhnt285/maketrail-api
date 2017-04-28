import mongoose, { Schema } from 'mongoose';

const { Types } = mongoose.Schema;

const relationSchema = new Schema(
  {
    tripLocalityId: Types.ObjectId,
    venueId: Types.ObjectId,
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

const LocalityVenueRelationModel = mongoose.model('LocalityVenueRelation', relationSchema);

export default LocalityVenueRelationModel;
