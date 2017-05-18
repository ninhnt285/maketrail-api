import FeedModel from '../models/feed';
import CommentModel from '../models/comment';
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

export default FeedService;
