import UserModel from '../models/user';
import FriendshipModel from '../models/friendship';
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
      socialInfo = await SocialUtils.FACEBOOK.getInfo(token);
      socialInfo.token = token;
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

UserService.isFriend = async function (user1, user2) {
  try {
    const tmp = await FriendshipModel.findOne({ user1, user2 });
    if (tmp) {
      const tmp2 = await FriendshipModel.findOne({user1: user2, user2: user1});
      if (tmp2) {
        return true;
      }
    }
  } catch (e) {
    return false;
  }
  return false;
};

UserService.addFriend = async function (user1, user2) {
  try {
    const item = await UserModel.findById(user2);
    await FriendshipModel.create({ user1, user2 });
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


export default UserService;
