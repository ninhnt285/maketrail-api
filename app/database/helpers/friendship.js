import UserModel from '../models/user';
import FriendshipModel from '../models/friendship';
import StatisticModel from '../models/statistic';
import NotificationService from '../helpers/notification';

const FriendshipService = {};

FriendshipService.getRelationship = async function (user1, user2) {
  try {
    const tmp = await FriendshipModel.findOne({ user1, user2 });
    if (!tmp) return {
      isFriend: false,
      isFollow: false,
      isSentRequest: false
    };
    return {
      isFriend: tmp.isFriend,
      isFollow: tmp.isFollow,
      isSentRequest: tmp.isSentRequest
    };
  } catch (e) {
    return false;
  }
};

FriendshipService.isFollowed = async function (user1, user2) {
  try {
    const tmp = await FriendshipModel.findOne({ user1, user2, isFollow: true });
    return !!tmp;
  } catch (e) {
    return false;
  }
};

FriendshipService.isFriend = async function (user1, user2) {
  try {
    const tmp = await FriendshipModel.findOne({ user1, user2, isFriend: true });
    return !!tmp;
  } catch (e) {
    return false;
  }
};

FriendshipService.addFriend = async function (user1, user2) {
  try {
    const tmp = await FriendshipModel.findOneAndUpdate({ user1, user2 }, {isFollow: true, isSentRequest: true });
    if (!tmp){
      await FriendshipModel.create({ user1, user2, isFollow: true, isSentRequest: true });
    }
    const item = await UserModel.findById(user2);
    return {
      item
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal Error']
    };
  }
};

FriendshipService.unFriend = async function (user1, user2) {
  try {
    await FriendshipModel.findOneAndRemove({ user1, user2 });
    await FriendshipModel.findOneAndRemove({ user1: user2, user2: user1 });
    const item = await UserModel.findById(user2);
    return {
      item
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal Error']
    };
  }
};

FriendshipService.answerAddFriend = async function (user, userId, choice) {
  try {
    if (choice === true) {
      await FriendshipModel.findOneAndUpdate({ user1: userId, user2: user.id }, {isFriend: true, isSentRequest: false});
      const tmp = await FriendshipModel.findOneAndUpdate({ user1: user.id, user2: userId }, {isFollow: true, isFriend: true});
      if (!tmp) {
        await FriendshipModel.create({ user1: user.id, user2: userId, isFollow: true, isFriend: true });
      }
      await NotificationService.notify(user.id, userId, null, NotificationService.Type.ACCEPT_FRIEND);
      await NotificationService.notify(userId, user.id, null, NotificationService.Type.ACCEPT_FRIEND);
    } else {
      await FriendshipModel.findOneAndUpdate({ user1: userId, user2: user.id }, { isSentRequest: false});
    }
    return {
      success: true
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal error']
    };
  }
};

FriendshipService.follow = async function (user1, user2) {
  try {
    const tmp = await FriendshipModel.findOneAndUpdate({ user1, user2 }, {isFollow: true});
    if (!tmp){
      await FriendshipModel.create({ user1, user2, isFollow: true });
    }
    const item = await UserModel.findById(user2);
    await NotificationService.notify(user1, user2, null, NotificationService.Type.FOLLOW);
    return {
      item
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal Error']
    };
  }
};

FriendshipService.unfollow = async function (user1, user2) {
  try {
    await FriendshipModel.findOneAndUpdate({ user1, user2 }, {isFollow: false});
    const item = await UserModel.findById(user2);
    return {
      item
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal Error']
    };
  }
};

FriendshipService.getFollowings = async function (user1) {
  try {
    return (await FriendshipModel.find({ user1, isFollow: true })).map(r => r.user2);
  } catch (e) {
    console.log(e);
    return [];
  }
};

FriendshipService.getHotUsers = async function () {
  try {
    const tmp = await StatisticModel.findOne({});
    return tmp.hotUsers;
  } catch (e) {
    console.log(e);
    return [];
  }
};

FriendshipService.countRequest = async function (user2) {
  try {
    return await FriendshipModel.count({user2, isSentRequest: true, isAnswer: false});
  } catch (e){
    console.log(e);
    return 0;
  }
};

export default FriendshipService;
