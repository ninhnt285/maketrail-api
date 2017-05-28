import mongoose, { Schema } from 'mongoose';

const { Types } = mongoose.Schema;

const interestSchema = new Schema(
  {
    fromId: String,
    toId: String,
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
