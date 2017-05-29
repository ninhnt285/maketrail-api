import NotificationModel from '../models/notification';
import InterestModel from '../models/interest';
import { getType, Type } from '../../lib/idUtils';

const NotificationService = {};

NotificationService.Type = {
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  POST: 'post',
  ADD_PHOTO: 'addPhoto',
  ADD_LOCALITY: 'addLocality',
  ADD_VENUE: 'addVenue'
};

NotificationService.notify = async function (fromId, toId, sourceId, type) {
  try {
    const obj = getType(toId);
    const date = new Date();
    date.setHours(date.getHours() - 5);
    if (obj === Type.USER) {
      if (fromId !== toId) {
        const tmp = await NotificationModel.findOne({userId: toId, toId, type, updatedAt: {$gt: date}});
        if (tmp) {
          const fromIds = tmp.fromIds;
          if (!(fromIds.includes(fromId))) fromIds.push(fromId);
          await NotificationModel.findByIdAndUpdate(tmp.id, {fromIds, sourceId});
        } else {
          await NotificationModel.create({userId: toId, fromIds: [fromId], toId, sourceId, type});
        }
      }
    } else {
      let users = [];
      if (obj !== Type.TRIP) {
        users = await InterestModel.find({toId});
      } else if (type !== this.Type.COMMENT) {
        users = await InterestModel.find({toId, level: 2});
      } else {
        users = await InterestModel.find({toId});
      }
      await Promise.all(users.map(async (r) => {
        if (fromId !== r.fromId) {
          const tmp = await NotificationModel.findOne({userId: r.fromId, toId, type, updatedAt: {$gt: date}});
          if (tmp) {
            const fromIds = tmp.fromIds;
            if (!(fromIds.includes(fromId))) fromIds.push(fromId);
            await NotificationModel.findByIdAndUpdate(tmp.id, {fromIds});
          } else {
            await NotificationModel.create({userId: r.fromId, fromIds: [fromId], toId, type});
          }
        }
      }));
    }
  } catch (e){
    console.log(e);
  }
};
NotificationService.countNotification = async function (userId) {
  try {
    return await NotificationModel.count({userId, isRead: false});
  } catch (e){
    console.log(e);
    return 0;
  }
};

NotificationService.interest = async function (fromId, toId, level) {
  try {
    await InterestModel.create({fromId, toId, level});
  } catch (e){
    console.log(e);
  }
};

NotificationService.disinterest = async function (fromId, toId) {
  try {
    await InterestModel.remove({fromId, toId});
  } catch (e){
    console.log(e);
  }
};

export default NotificationService;
