import fs from 'fs';
import path from 'path';
import uniqid from 'uniqid';
import crypto from 'crypto';
import PhotoModel from '../models/photo';
import VideoModel from '../models/video';
import { resize, downloadFileHttp } from '../../lib/google/place/photo';
import { Type, getType } from '../../lib/idUtils';

const videoMimes = ['.mkv', '.flv', '.vob', '.avi', '.mov', '.wmv', '.rm', '.rmvb', '.amv', '.mp4', '.mpg', '.mpeg', '.m4v', '.3gp'];

function isVideo(mimeType) {
  if (videoMimes.indexOf(mimeType.toLowerCase()) >= 0) return true;
  return false;
}

const AttachmentService = {};

AttachmentService.canGetAttachment = async function (user, userId) {
  return (user && userId);
};

AttachmentService.findById = async function (id) {
  try {
    const type = getType(id);
    if (type === Type.VIDEO) {
      return await VideoModel.findById(id);
    }
    return await PhotoModel.findById(id);
  } catch (e) {
    console.log(e);
    return null;
  }
};

AttachmentService.getById = async function (user, id) {
  try {
    const bcanGetAttachment = await this.canGetAttachment(user, id);
    if (bcanGetAttachment) {
      const type = getType(id);
      if (type === Type.VIDEO) {
        return await VideoModel.findById(id);
      }
      return await PhotoModel.findById(id);
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};

AttachmentService.getByPlaceId = async function (placeId) {
  try {
    const photos = await PhotoModel.find({ placeId });
    return photos;
  } catch (e) {
    console.log(e);
  }
  return [];
};

AttachmentService.getByParentId = async function (parentId) {
  try {
    const photos = await PhotoModel.find({ parentId });
    const videos = await VideoModel.find({ parentId });
    return photos.concat(videos);
  } catch (e) {
    console.log(e);
  }
  return [];
};

AttachmentService.updatePlace = async function (id, placeId, placeName) {
  try {
    const tmp = getType(id);
    let item = null;
    if (tmp === Type.PHOTO) {
      item = await PhotoModel.findByIdAndUpdate(id, { placeId, placeName });
    } else {
      item = await VideoModel.findByIdAndUpdate(id, { placeId, placeName });
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

AttachmentService.upload = async function (user, file, caption, parentId, placeId, placeName) {
  if (!file) {
    // const item = await PhotoModel.create({
    //   name: 'test.jpg',
    //   url: 'test.jpg',
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
  try {
    const mimeType = file.originalname.substring(file.originalname.lastIndexOf('.'));
    let imageName;
    let previewUrl;
    let uri;
    let fileName;
    const date = new Date();
    const isV = isVideo(mimeType);
    let item = null;
    if (isV) {
      imageName = `/video/${date.getUTCFullYear()}/${(date.getUTCMonth() + 1)}/${crypto.createHash('md5').update(file.originalname + uniqid()).digest('hex')}${mimeType}`;
      uri = imageName.replace('%s', '');
      fileName = path.join(__dirname, '../../../static/', uri);
      fs.writeFileSync(fileName, file.buffer);
      item = await VideoModel.create({
        name: file.originalname,
        url: imageName,
        userId: user.id,
        caption,
        parentId,
        placeId,
        placeName,
        privacy: 0
      });
    } else {
      imageName = `/photo/${date.getUTCFullYear()}/${(date.getUTCMonth() + 1)}/${crypto.createHash('md5').update(file.originalname + uniqid()).digest('hex')}%s${mimeType}`;
      previewUrl = imageName.replace('%s', '_150_square');
      uri = imageName.replace('%s', '');
      fileName = path.join(__dirname, '../../../static/', uri);
      fs.writeFileSync(fileName, file.buffer);
      item = await PhotoModel.create({
        name: file.originalname,
        url: imageName,
        previewUrl,
        userId: user.id,
        caption,
        parentId,
        placeId,
        placeName,
        privacy: 0
      });
      resize(uri);
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

AttachmentService.loadRenderedVideo = async function (file, url) {
  try {
    const mimeType = file.substring(file.lastIndexOf('.'));
    const parentId = file.substring(0, file.lastIndexOf('.') - 1);
    const date = new Date();
    const videoName = `/video/${date.getUTCFullYear()}/${(date.getUTCMonth() + 1)}/${crypto.createHash('md5').update(file + uniqid()).digest('hex')}${mimeType}`;
    const fileName = path.join(__dirname, '../../../static/', videoName);
    downloadFileHttp(url, fileName).then(async (fileDest) => {
      await VideoModel.create({
        name: file,
        parentId,
        url: videoName,
        privacy: 0
      });
    });
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal error']
    };
  }
};

export default AttachmentService;
