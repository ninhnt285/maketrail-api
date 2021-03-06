import UserModel from '../models/user';
import FriendshipModel from '../models/friendship';
import StatisticModel from '../models/statistic';
import CountryModel from '../models/country';
import TraceModel from '../models/trace';
import MailService from '../../lib/mail';
import NotificationService from '../helpers/notification';
import RedisService from './redis';
import { generateToken, verifyToken } from '../../lib/token';
import { generateHash } from '../../lib/hash';
import SocialUtils from '../../lib/social';
import { drawUserMap } from '../../lib/map';

const ObjectId = require('mongoose').Types.ObjectId;

const UserService = {};

UserService.canGetUser = async function (user, userId) {
  return (user && userId);
};

UserService.findById = async function (id) {
  try {
    let user = await RedisService.get(id);
    if (!user) {
      user = await UserModel.findById(id);
      await RedisService.set(id, user);
    }
    return user;
  } catch (e) {
    console.log(e);
    return null;
  }
};

UserService.getById = async function (user, id) {
  try {
    const bcanGetUser = await this.canGetUser(user, id);
    if (bcanGetUser) {
      const result = await this.findById(id);
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
    await RedisService.set(item.id, item);
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
    const userTmp = await UserModel.findOneAndUpdate({ _id: user.id, password: passwordHash }, { password: passwordHashNew });
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

UserService.changePasswordNoUser = async function (token, newPassword) {
  try {
    const passwordHashNew = await generateHash(newPassword);
    const user = verifyToken(token);
    const userTmp = await UserModel.findByIdAndUpdate(user.id, { password: passwordHashNew });
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

UserService.forgotPassword = async function (email) {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return {
        errors: ['Invalid email']
      };
    }
    const token = generateToken(user);
    MailService.sendResetPassMail(user.fullName, email, token);
    return '';
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

UserService.getImageMap = async function (userId) {
  await drawUserMap(userId);
  return `/maps/userPng/${userId}.png`;
};

UserService.getMap = async function (userId, parentId) {
  try {
    const visiteds = await TraceModel.find({ parentId, userId });
    const now = Math.floor((new Date().getTime() / 1000));
    const res = [];
    for (let i = 0; i < visiteds.length; i++) {
      let visited = visiteds[i];
      if (visited.arrivalTime && now > visited.arrivalTime) {
        visited = await TraceModel.findByIdAndUpdate(visited.id, { number: visited.number + 1, arrivalTime: null }, { new: true });
      }
      res.push({ code: visited.svgId, status: visited.number > 0 ? 1 : 2 });
    }
    return res;
  } catch (e) {
    console.log(e);
  }
  return [];
};

UserService.getCountries = async function (userId, parentId) {
  try {
    const visiteds = await TraceModel.find({ parentId, userId });
    const now = Math.floor((new Date().getTime() / 1000));
    const res = {};
    for (let i = 0; i < visiteds.length; i++) {
      let visited = visiteds[i];
      if (visited.arrivalTime && now > visited.arrivalTime) {
        visited = await TraceModel.findByIdAndUpdate(visited.id, { number: visited.number + 1, arrivalTime: null }, { new: true });
      }
      res[visited.svgId] = {
        status: visited.number > 0 ? 1 : 2
      };
    }
    return res;
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
    const results = await TraceModel.aggregate([
      {
        $match: {
          parentId: { $ne: null },
          userId: new ObjectId(userId)
        }
      },
      {
        $group: {
          _id: '$parentId',
          count: { $sum: 1 }
        }
      }
    ]).exec();
    results.sort((a, b) => a.count < b.count);
    if (results.length === 0) return null;
    const country = await CountryModel.findOne({ svgId: results[0]._id });
    const percent = Math.floor(results[0].count * 100 / country.children);
    return `${country.name}: ${results[0].count}/${country.children} Cities (${percent}%)`;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default UserService;
