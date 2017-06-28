import UserModel from '../models/user';
import FriendshipModel from '../models/friendship';
import StatisticModel from '../models/statistic';
import CountryModel from '../models/country';
import TraceModel from '../models/trace';
import NotificationService from '../helpers/notification';
import { generateToken } from '../../lib/token';
import { generateHash } from '../../lib/hash';
import SocialUtils from '../../lib/social';

const UserService = {};

UserService.canGetUser = async function (user, userId) {
  return (user && userId);
};

UserService.findById = async function (id) {
  try {
    return await UserModel.findById(id);
  } catch (e) {
    console.log(e);
    return null;
  }
};

UserService.getById = async function (user, id) {
  try {
    const bcanGetUser = await this.canGetUser(user, id);
    if (bcanGetUser) {
      const result = await UserModel.findById(id).exec();
      return result;
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};

UserService.update = async function (user, args) {
  try {
    const item = await UserModel.findByIdAndUpdate(user.id, { $set: args }, { new: true });
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

UserService.register = async function (username, email, password, fullName) {
  try {
    if (await UserModel.findOne({ $or: [{ username }, { email }] })) {
      return {
        errors: ['Username or email existed']
      };
    }
    const passwordHash = await generateHash(password);
    const newUser = await UserModel.create({ fullName, username, email, password: passwordHash });
    const accessToken = generateToken(newUser);
    return {
      accessToken
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal Error']
    };
  }
};

UserService.loginViaEmail = async function (email, password) {
  try {
    const passwordHash = await generateHash(password);
    const user = await UserModel.findOne({ email, password: passwordHash });
    if (!user) {
      return {
        errors: ['Invalid email or password']
      };
    }
    const accessToken = generateToken(user);
    return {
      accessToken
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal Error']
    };
  }
};

UserService.changePassword = async function (user, password, newPassword) {
  try {
    const passwordHash = await generateHash(password);
    const passwordHashNew = await generateHash(newPassword);
    const userTmp = await UserModel.findOneAndUpdate({ id: user.id, password: passwordHash }, { password: passwordHashNew });
    if (!userTmp) {
      return {
        errors: ['Invalid password']
      };
    }
    const accessToken = generateToken(userTmp);
    return {
      accessToken
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal Error']
    };
  }
};

UserService.loginViaUsername = async function (username, password) {
  try {
    const passwordHash = await generateHash(password);
    const user = await UserModel.findOne({ username, password: passwordHash });
    if (!user) {
      return {
        errors: ['Invalid email or password']
      };
    }
    const accessToken = generateToken(user);
    return {
      accessToken
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal Error']
    };
  }
};

UserService.findOneOrCreate = async function (condition, doc) {
  let user = await UserModel.findOneAndUpdate(condition, { $set: doc }, { new: true });
  if (!user) {
    user = await UserModel.create(doc);
  }
  return user;
};

UserService.loginViaSocialNetwork = async function (provider, token, tokenSecret) {
  try {
    let socialInfo = null;
    let user = null;
    if (provider === 'facebook') {
      const longLivedToken = await SocialUtils.FACEBOOK.getLongLivedToken(token);
      socialInfo = await SocialUtils.FACEBOOK.getInfo(longLivedToken);
      socialInfo.token = longLivedToken;
      user = await this.findOneOrCreate({ 'facebook.id': socialInfo.id }, { facebook: socialInfo, fullName: socialInfo.name, email: socialInfo.email, username: socialInfo.id });
    } else if (provider === 'google') {
      socialInfo = await SocialUtils.GOOGLE.getInfo(token);
      socialInfo.token = token;
      user = await this.findOneOrCreate({ 'google.id': socialInfo.id }, { google: socialInfo, fullName: socialInfo.name, email: socialInfo.email, username: socialInfo.username });
    } else if (provider === 'twitter') {
      socialInfo = await SocialUtils.TWITTER.getInfo(token, tokenSecret);
      socialInfo.token = token;
      socialInfo.tokenSecret = tokenSecret;
      user = await this.findOneOrCreate({ 'twitter.id': socialInfo.id }, { twitter: socialInfo, fullName: socialInfo.name, email: socialInfo.email, username: socialInfo.username });
    }
    const accessToken = generateToken(user);
    return {
      accessToken
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal Error']
    };
  }
};

UserService.isFollowed = async function (user1, user2) {
  try {
    const tmp = await FriendshipModel.findOne({ user1, user2 });
    return !!tmp;
  } catch (e) {
    return false;
  }
};

UserService.follow = async function (user1, user2) {
  try {
    const bool = await this.isFollowed(user1, user2);
    if (bool) {
      return {
        errors: ['You have followed this one.']
      };
    }
    const res = await Promise.all([UserModel.findById(user2), FriendshipModel.create({ user1, user2 }), NotificationService.interest(user1, user2, 1)]);
    await NotificationService.notify(user1, user2, null, NotificationService.Type.FOLLOW);
    return {
      item: res[0]
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal Error']
    };
  }
};

UserService.unfollow = async function (user1, user2) {
  try {
    const bool = await this.isFollowed(user1, user2);
    if (!bool) {
      return {
        errors: ['You have not followed this one yet.']
      };
    }
    const res = await Promise.all([UserModel.findById(user2), FriendshipModel.remove({ user1, user2 }), NotificationService.disinterest(user1, user2)]);
    return {
      item: res[0]
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal Error']
    };
  }
};

UserService.getFolloweds = async function (user1) {
  try {
    return (await FriendshipModel.find({ user1 })).map(r => r.user2);
  } catch (e) {
    console.log(e);
    return [];
  }
};

UserService.getHotUsers = async function () {
  try {
    const tmp = await StatisticModel.findOne({});
    return tmp.hotUsers;
  } catch (e) {
    console.log(e);
    return [];
  }
};

UserService.getFacebookFriends = async function (userId) {
  try {
    const obj = await UserModel.findById(userId);
    if (obj.facebook && obj.facebook.token) {
      const friends = await SocialUtils.FACEBOOK.getFriends(obj.facebook.token);
      return friends;
    }
  } catch (e) {
    console.log(e);
  }
  return [];
};

UserService.getMap = async function (userId, parentId) {
  try {
    const items = await CountryModel.find({ parentId });
    const visiteds = await TraceModel.find({ parentId, userId });
    return items.map((item) => {
      for (let i = 0; i < visiteds.length; i++) {
        if (item.id === visiteds[i].countryId) {
          return {
            code: item.svgId,
            name: item.name,
            status: visiteds[i].status ? 2 : 1
          };
        }
      }
      return {
        code: item.svgId,
        name: item.name,
        status: 0
      };
    });
  } catch (e) {
    console.log(e);
  }
  return null;
};

UserService.getVisitedNumber = async function (userId, parentId) {
  try {
    const visitedNumber = await TraceModel.count({ parentId, userId });
    return visitedNumber;
  } catch (e) {
    console.log(e);
    return 0;
  }
};

UserService.getFavouriteCountry = async function (userId) {
  try {
    TraceModel.aggregate([
      {
        $match: {
          userId
        }
      },
      {
        $group: {
          _id: '$parentId',
          count: { $sum: 1 }
        }
      }
    ], (err, results) => {
      if (!err) {
        results.sort((a, b) => a.count < b.count);
        return results.isEmpty() ? null : results[0]._id;
      }
    });
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default UserService;
