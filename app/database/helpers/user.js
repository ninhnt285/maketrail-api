import UserModel from '../models/user';
import { generateToken } from '../../lib/token';
import { generateHash } from '../../lib/hash';
import { getType } from '../../lib/idUtils';

const Service = {};

Service.canGetUser = async function (user, userId) {
  return (user && userId);
};

Service.getById = async function (user, id) {
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

Service.register = async function (username, email, password, fullName) {
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

Service.loginViaEmail = async function (email, password) {
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

Service.loginViaUsername = async function (username, password) {
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

Service.findOneOrCreate = async function (condition, doc) {
  let user = await UserModel.findOneAndUpdate(condition, { $set: doc }, { new: true });
  if (!user) {
    user = await UserModel.create(doc);
  }
  return user;
};

Service.loginViaSocialNetwork = async function (type, socialInfo) {
  try {
    let user = null;
    if (type === 'facebook') {
      user = await this.findOneOrCreate({ 'facebook.id': socialInfo.id }, { facebook: socialInfo });
    } else if (type === 'google') {
      user = await this.findOneOrCreate({ 'google.id': socialInfo.id }, { google: socialInfo });
    } else if (type === 'twitter') {
      user = await this.findOneOrCreate({ 'twitter.id': socialInfo.id }, { twitter: socialInfo });
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


export default Service;
