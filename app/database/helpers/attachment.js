import fs from 'fs';
import path from 'path';
import uniqid from 'uniqid';
import crypto from 'crypto';
import AttachmentModel from '../models/attachment';
import { resize } from '../../lib/google/place/photo';

const videoMimes = ['mkv', 'flv', 'vob', 'avi', 'mov', 'wmv', 'rm', 'rmvb', 'amv', 'mp4', 'mpg', 'mpeg', 'm4v', '3gp'];

function isVideo(mimeType) {
  if (videoMimes.indexOf(mimeType) >= 0) return true;
  return false;
}

const AttachmentService = {};

AttachmentService.canGetAttachment = async function (user, userId) {
  return (user && userId);
};

AttachmentService.findById = async function (id) {
  try {
    return await AttachmentModel.findById(id);
  } catch (e) {
    console.log(e);
    return null;
  }
};

AttachmentService.getById = async function (user, id) {
  try {
    const bcanGetAttachment = await this.canGetAttachment(user, id);
    if (bcanGetAttachment) {
      const result = await AttachmentModel.findById(id).exec();
      return result;
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};

AttachmentService.upload = async function (user, file, caption) {
  if (!file) {
    const imageName = '/photo/test%s.jpg';
    const item = await AttachmentModel.create({
      name: 'test.jpg',
      url: imageName,
      // previewUrl: imageName.replace('%s', '_150_square'),
      userId: user.id,
      caption,
      privacy: 0
    });
    return {
      item
    };
    // return {
    //   errors: ['Invalid file']
    // };
  }
  const mimeType = file.originalname.substring(file.originalname.lastIndexOf('.'));
  let imageName;
  let previewUrl;
  const date = new Date();
  const isV = isVideo(mimeType);
  if (isV) {
    imageName = `/video/${date.getUTCFullYear()}/${(date.getUTCMonth() + 1)}/${crypto.createHash('md5').update(file.originalname + uniqid()).digest('hex')}.${mimeType}`;
  } else {
    imageName = `/photo/${date.getUTCFullYear()}/${(date.getUTCMonth() + 1)}/${crypto.createHash('md5').update(file.originalname + uniqid()).digest('hex')}%s.${mimeType}`;
    previewUrl = imageName.replace('%s', '_150_square');
  }
  const uri = imageName.replace('%s', '');
  const fileName = path.join(__dirname, '../../../static/', uri);

  try {
    await fs.writeFile(fileName, file.buffer);
    const item = await AttachmentModel.create({
      name: file.originalname,
      url: imageName,
      previewUrl,
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

export default AttachmentService;
