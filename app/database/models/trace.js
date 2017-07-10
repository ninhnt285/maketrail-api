import mongoose, { Schema } from 'mongoose';

const { Types } = mongoose.Schema;

const relationSchema = new Schema(
  {
    userId: Types.ObjectId,
    svgId: String,
    parentId: String,
    status: Boolean,
    arrivalTime: Number,
    number: { type: Number, default: 0 }
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

const TraceModel = mongoose.model('Trace', relationSchema);

export default TraceModel;
