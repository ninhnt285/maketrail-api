import mongoose, { Schema } from 'mongoose';

const { Types } = mongoose.Schema;

const relationSchema = new Schema(
  {
    userId: Types.ObjectId,
    countryId: String,
    parentId: String,
    status: Boolean
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

const TraceModel = mongoose.model('TraceRelation', relationSchema);

export default TraceModel;
