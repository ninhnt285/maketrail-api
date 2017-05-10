import fs from 'fs';
import path from 'path';
import uniqid from 'uniqid';
import crypto from 'crypto';
import ItemModel from '../models/item';
import { resize } from '../../lib/google/place/photo';

const videoMimes = ['mkv', 'flv', 'vob', 'avi', 'mov', 'wmv', 'rm', 'rmvb', 'amv', 'mp4', 'mpg', 'mpeg', 'm4v', '3gp'];

function isVideo(mimeType) {
  if (videoMimes.indexOf(mimeType) >= 0) return true;
  return false;
}

const ItemService = {};

ItemService.canGetItem = async function (user, userId) {
  return (user && userId);
};

ItemService.findById = async function (id) {
  try {
    return await ItemModel.findById(id);
  } catch (e) {
    console.log(e);
    return null;
  }
};

ItemService.getById = async function (user, id) {
  try {
    const bcanGetItem = await this.canGetItem(user, id);
    if (bcanGetItem) {
      const result = await ItemModel.findById(id).exec();
      return result;
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};

ItemService.upload = async function (user, file, caption) {
  if (!file) {
    // const item = await ItemModel.create({
    //   url: '/items/test.jpg',
    //   userId: user.id,
    //   caption,
    //   privacy: 0
    // });
    // return {
    //   item
    // };
    return {
      errors: ['Invalid file']
    };
  }
  const mimeType = file.originalname.substring(file.originalname.lastIndexOf('.'));
  let imageName;
  const date = new Date();
  const isV = isVideo(mimeType);
  if (isV) {
    imageName = `/item/${date.getUTCFullYear()}/${(date.getUTCMonth() + 1)}/${crypto.createHash('md5').update(file.originalname + uniqid()).digest('hex')}.${mimeType}`;
  } else {
    imageName = `/item/${date.getUTCFullYear()}/${(date.getUTCMonth() + 1)}/${crypto.createHash('md5').update(file.originalname + uniqid()).digest('hex')}%s.${mimeType}`;
  }
  const uri = imageName.replace('%s', '');
  const fileName = path.join(__dirname, '../../../static/', uri);

  try {
    await fs.writeFile(fileName, file.buffer);
    const item = await ItemModel.create({
      url: imageName,
      userId: user.id,
      caption,
      privacy: 0
    });
    if (!isV) resize(uri);
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

export default ItemService;
