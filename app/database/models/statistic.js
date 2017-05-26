import mongoose, { Schema } from 'mongoose';

const { Types } = mongoose.Schema;

const statisticSchema = new Schema(
  {
    hotUsers: [Types.ObjectId]
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

const StatisticModel = mongoose.model('Statistic', statisticSchema);

export default StatisticModel;
