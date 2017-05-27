import FeedModel from '../models/feed';
import CommentModel from '../models/comment';
import NotificationService from '../helpers/notification';
import { getNode, getNodeFromId } from '../helpers/node';
import LikeModel from '../models/like';
import { getType, Type } from '../../lib/idUtils';

const Activity = {
  POST: 0,
  SHARE: 1,
  PHOTO: 2,
  VIDEO: 3
};

const FeedService = {};

FeedService.canGetFeed = async function (user, userId) {
  return (user && userId);
};

FeedService.findById = async function (id) {
  try {
    return await FeedModel.findById(id);
  } catch (e) {
    console.log(e);
    return null;
  }
};

FeedService.getById = async function (user, id) {
  try {
    const bcanGetFeed = await this.canGetFeed(user, id);
    if (bcanGetFeed) {
      const result = await FeedModel.findById(id).exec();
      return result;
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};

FeedService.like = async function (user, parentId) {
  try {
    const item = await LikeModel.create({
      fromId: user.id,
      parentId
    });
    const type = getType(parentId);
    if (type !== Type.TRIP) {
      await NotificationService.notify(user.id, parentId, item.id, NotificationService.Type.LIKE);
    }
    return {
      item
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal error']
    };
  }
};

FeedService.share = async function (user, toId, parentId, text) {
  try {
    const item = await FeedModel.create({
      fromId: user.id,
      toId: toId || user.id,
      parentId,
      privacy: 0,
      type: Activity.SHARE,
      text
    });
    await NotificationService.interest(user.id, item.id, 2);
    return {
      item
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal error']
    };
  }
};

FeedService.comment = async function (user, parentId, text) {
  try {
    const item = await CommentModel.create({
      fromId: user.id,
      parentId,
      text
    });
    if (getType(parentId) === Type.COMMENT) {
      await NotificationService.interest(user.id, parentId, 1);
    }
    await NotificationService.interest(user.id, item.id, 2);
    await NotificationService.notify(user.id, parentId, item.id, NotificationService.Type.COMMENT);
    return {
      item
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal error']
    };
  }
};

FeedService.post = async function (user, toId, text, attachments) {
  try {
    let type = Activity.POST;
    let tmp = '';
    for (let i = 0; i < attachments.length; i++) {
      tmp = getType(attachments[i]);
      if (tmp === Type.PHOTO){
        type = Activity.PHOTO;
        break;
      } else if (tmp === Type.VIDEO){
        type = Activity.VIDEO;
      }
    }
    const item = await FeedModel.create({
      fromId: user.id,
      toId: toId || user.id,
      privacy: 0,
      text,
      type,
      attachments
    });
    await NotificationService.interest(user.id, item.id, 2);
    await NotificationService.notify(user.id, toId, item.id, NotificationService.Type.POST);
    return {
      item
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal error']
    };
  }
};

FeedService.getStatistics = async function (id){
  try {
    const res = await Promise.all([FeedModel.count({parentId: id, type: Activity.SHARE}), LikeModel.count({ parentId: id }), CommentModel.count({parentId: id})]);
    return {
      shareCount: res[0],
      likeCount: res[1],
      commentCount: res[2]
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};

FeedService.getLikeCount = async function (id){
  return await LikeModel.count({ parentId: id });
};

FeedService.isLiked = async function (fromId, parentId){
  try {
    const tmp = await LikeModel.findOne({ fromId, parentId });
    return !!tmp;
  } catch (e) {
    return false;
  }
};

export default FeedService;
