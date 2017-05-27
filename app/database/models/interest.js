import mongoose, { Schema } from 'mongoose';

const { Types } = mongoose.Schema;

const interestSchema = new Schema(
  {
    fromId: Types.ObjectId,
    toId: Types.ObjectId,
    level: Number
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

const InterestModel = mongoose.model('Interest', interestSchema);

export default InterestModel;
