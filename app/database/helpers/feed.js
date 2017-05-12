import FeedModel from '../models/feed';
import CommentModel from '../models/comment';

const Activity = {
  POST: 0,
  LIKE: 1,
  SHARE: 2,
  COMMENT: 3
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

FeedService.like = async function (user, objectId) {
  try {
    const item = await FeedModel.create({
      userId: user.id,
      objectId,
      type: Activity.LIKE,
      privacy: 0,
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

FeedService.share = async function (user, objectId) {
  try {
    const item = await FeedModel.create({
      userId: user.id,
      objectId,
      type: Activity.SHARE,
      privacy: 0,
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

FeedService.comment = async function (user, objectId, parentId, text) {
  try {
    await CommentModel.create({
      userId: user.id,
      parentId: parentId || objectId,
      text
    });
    const item = await FeedModel.create({
      userId: user.id,
      objectId,
      type: Activity.COMMENT,
      privacy: 0,
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

FeedService.post = async function (user, objectId, text, attachments) {
  try {
    const item = await FeedModel.create({
      userId: user.id,
      objectId: objectId || user.id,
      type: Activity.POST,
      privacy: 0,
      content: {
        text,
        attachments
      }
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

FeedService.getStatistics = async function (objectId){
  try {
    const res = await Promise.all([FeedModel.count({objectId, type: Activity.LIKE}), FeedModel.count({ objectId, type: Activity.SHARE}), CommentModel.count({parentId: objectId})]);
    return {
      likeCount: res[0],
      shareCount: res[1],
      commentCount: res[2]
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default FeedService;
