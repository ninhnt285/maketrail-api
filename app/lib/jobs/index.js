import FriendshipModel from '../../database/models/friendship';
import StatisticModel from '../../database/models/statistic';
const CronJob = require('cron').CronJob;

const statistic = function () {
  try {
    FriendshipModel.aggregate([
      {
        $group: {
          _id: '$user2',
          count: { $sum: 1 }
        }
      }
    ], (err, results) => {
      if (!err) {
        results.sort((a, b) => {
          return a.count < b.count;
        });
        const hotUsers = results.slice(0, 100).map(r => r._id);
        StatisticModel.findOneAndUpdate({}, { hotUsers }, (err2, res) => {
          if (!err2 && !res) {
            StatisticModel.create({ hotUsers }, (err3) => {
            });
          }
        });
      }
    });
  } catch (e) {
    console.log(e);
  }
};

export function statisticalJob() {
  statistic();
  new CronJob('0 0 0 * * *', statistic, null, true, null);
}
