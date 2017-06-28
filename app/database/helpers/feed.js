import FeedModel from '../models/feed';
import CommentModel from '../models/comment';
import PhotoModel from '../models/photo';
import VideoModel from '../models/video';
import TripModel from '../models/trip';
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

FeedService.unlike = async function (user, parentId) {
  try {
    const item = await LikeModel.findOneAndRemove({
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
    let rootId = parentId;
    if (getType(parentId) === Type.COMMENT) {
      const parentComment = await CommentModel.findById(parentId);
      rootId = parentComment.rootId;
      await NotificationService.interest(user.id, parentId, 1);
    }
    const item = await CommentModel.create({
      fromId: user.id,
      parentId,
      rootId,
      text
    });
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

FeedService.post = async function (user, toId, text, attachments, placeId, placeName) {
  try {
    let type = Activity.POST;
    let tmp = '';
    if (attachments) {
      for (let i = 0; i < attachments.length; i++) {
        tmp = getType(attachments[i]);
        if (tmp === Type.PHOTO) {
          type = Activity.PHOTO;
          await PhotoModel.findByIdAndUpdate(attachments[i], { placeId, placeName, parentId: toId || user.id });
        } else if (tmp === Type.VIDEO) {
          if (tmp === '') type = Activity.VIDEO;
          await VideoModel.findByIdAndUpdate(attachments[i], { placeId, placeName, parentId: toId || user.id });
        }
      }
    }
    const item = await FeedModel.create({
      fromId: user.id,
      toId: toId || user.id,
      privacy: 0,
      text,
      type,
      placeId,
      placeName,
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

FeedService.update = async function (user, feedId, args) {
  try {
    let tmp = '';
    let attachments = [];
    if (args.placeId && args.placeName) {
      if (args.attachments){
        attachments = args.attachments;
      } else {
        const tmpItem = await FeedModel.findById(feedId);
        attachments = tmpItem.attachments;
      }
      for (let i = 0; i < attachments.length; i++) {
        tmp = getType(attachments[i]);
        if (tmp === Type.PHOTO) {
          await PhotoModel.findByIdAndUpdate(attachments[i], { placeIdL: args.placeId, placeName: args.placeName });
        } else if (tmp === Type.VIDEO) {
          await VideoModel.findByIdAndUpdate(attachments[i], { placeId: args.placeId, placeName: args.placeName });
        }
      }
    }
    const item = await FeedModel.findByIdAndUpdate(feedId, { $set: args }, { new: true });
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

FeedService.delete = async function (user, feedId) {
  try {
    const item = await FeedModel.findByIdAndRemove(feedId);
    let tmp = '';
    if (item.attachments) {
      for (let i = 0; i < item.attachments.length; i++) {
        tmp = getType(item.attachments[i]);
        if (tmp === Type.PHOTO) {
          await PhotoModel.findByIdAndRemove(item.attachments[i]);
        } else if (tmp === Type.VIDEO) {
          await VideoModel.findByIdAndRemove(item.attachments[i]);
        }
      }
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

FeedService.publishTrip = async function (user, tripId) {
  try {
    await TripModel.findByIdAndUpdate(tripId, { isPublished: true });
    const item = await FeedModel.create({
      fromId: user.id,
      toId: user.id,
      privacy: 0,
      parentId: tripId,
      type: Activity.POST
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
