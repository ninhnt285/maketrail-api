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
    if (obj === Type.USER) {
      if (fromId !== toId) {
        await NotificationModel.remove({ userId: toId, toId, type });
        await NotificationModel.create({ userId: toId, fromId, toId, sourceId, type });
      }
    } else {
      let users = [];
      users = await InterestModel.find({toId});
      await Promise.all(users.map(async (r) => {
        if (fromId !== r.fromId) {
          await NotificationModel.remove({userId: r.fromId, toId, type });
          await NotificationModel.create({userId: r.fromId, fromId, toId, sourceId, type});
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
