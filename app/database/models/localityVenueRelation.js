import mongoose, { Schema } from 'mongoose';
import preSave from '../preSave';

const { Types } = mongoose.Schema;

const relationSchema = new Schema(
  {
    _id: Types.ObjectId,
    tripLocalityId: String,
    venueId: String,
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

relationSchema.pre('save', preSave('LocalityVenueType'));
const LocalityVenueRelationModel = mongoose.model('LocalityVenueRelation', relationSchema);

export default LocalityVenueRelationModel;
