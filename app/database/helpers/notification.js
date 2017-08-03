import NotificationModel from '../models/notification';
import InterestModel from '../models/interest';
import { getType, Type } from '../../lib/idUtils';

const NotificationService = {};

NotificationService.Type = {
  LIKE: 'like', // someone like an object -> notify object owner
  COMMENT: 'comment', // someone like an object -> notify interested people
  FOLLOW: 'follow', // someone follow a person -> notify that person
  ACCEPT_FRIEND: 'acceptFriend', // someone make friend with a person -> notify that person
  POST: 'post', // someone post to a person profile -> notify that person
  ADD_PHOTO: 'addPhoto',
  ADD_LOCALITY: 'addLocality', // add new locality to trip -> notify all trip member
  ADD_VENUE: 'addVenue',
  INVITE_TO_TRIP: 'inviteToTrip', // invite new member -> notify
  JOIN_TRIP: 'joinTrip', // new member join trip -> notify all trip member
  PUBLISH_TRIP: 'publishTrip', // publish a trip -> notify all trip member
  EXPORT_VIDEO: 'exportVideo' // export trip's video -> notify all trip member
};

NotificationService.notify = async function (fromId, toId, sourceId, type) {
  try {
    const obj = getType(toId);
    if (obj === Type.USER) {
      if (fromId !== toId) {
        if (type !== this.Type.INVITE_TO_TRIP){
          await NotificationModel.remove({userId: toId, toId, type});
        }
        await NotificationModel.create({userId: toId, fromId, toId, sourceId, type});
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

NotificationService.remove = async function (id) {
  try {
    return await NotificationModel.findByIdAndRemove(id);
  } catch (e){
    console.log(e);
    return null;
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
