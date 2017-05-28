import mongoose, { Schema } from 'mongoose';

const { Types } = mongoose.Schema;

const statisticSchema = new Schema(
  {
    hotUsers: [String]
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
