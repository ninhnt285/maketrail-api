import fs from 'fs';
import path from 'path';
import uniqid from 'uniqid';
import crypto from 'crypto';
import PhotoModel from '../models/photo';
import VideoModel from '../models/video';
import TripModel from '../models/trip';
import FeedModel from '../models/feed';
import NotificationService from '../helpers/notification';
import { resize, downloadFileHttp, parseDMS } from '../../lib/google/place/photo';
import { processVideo, extractPreviewImage } from '../../lib/video';
import { Type, getType } from '../../lib/idUtils';

const ExifImage = require('exif').ExifImage;
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

AttachmentService.getByPlaceId = async function (parentId, placeId) {
  try {
    const photos = await PhotoModel.find({ parentId, placeId });
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
    return {
      errors: ['Invalid file']
    };
  }
  try {
    const mimeType = file.originalname.substring(file.originalname.lastIndexOf('.'));
    let imageName;
    let videoName;
    let previewUrl;
    let uri;
    let fileName;
    let location;
    const date = new Date();
    const isV = isVideo(mimeType);
    let item = null;

    if (isV) {
      videoName = `/video/${date.getUTCFullYear()}/${(date.getUTCMonth() + 1)}/${crypto.createHash('md5').update(file.originalname + uniqid()).digest('hex')}.mp4`;
      imageName = `/photo/${date.getUTCFullYear()}/${(date.getUTCMonth() + 1)}/${crypto.createHash('md5').update(file.originalname + uniqid()).digest('hex')}%s.jpg`;
      previewUrl = imageName.replace('%s', '_150_square');
      uri = imageName.replace('%s', '');
      fileName = path.join(__dirname, '../../../static/', videoName);
      fs.writeFileSync(fileName, file.buffer);
      new ExifImage({ image: fileName }, (error, exifData) => {
        if (error) {
          console.log(`Error: ${error.message}`);
        } else {
          console.log(exifData);
        }
      });
      item = await VideoModel.create({
        name: file.originalname,
        url: videoName,
        userId: user.id,
        caption,
        parentId,
        placeId,
        placeName,
        previewUrl,
        isProcessing: false,
        privacy: 0
      });
      await extractPreviewImage(videoName, uri);
      processVideo(item.id, videoName);
    } else {
      imageName = `/photo/${date.getUTCFullYear()}/${(date.getUTCMonth() + 1)}/${crypto.createHash('md5').update(file.originalname + uniqid()).digest('hex')}%s${mimeType}`;
      previewUrl = imageName.replace('%s', '_150_square');
      uri = imageName.replace('%s', '');
      fileName = path.join(__dirname, '../../../static/', uri);
      fs.writeFileSync(fileName, file.buffer);
      new ExifImage({ image: fileName }, (error, exifData) => {
        if (!error && exifData.gps) {
          location = parseDMS(exifData.gps);
          // console.log(location);
        }
      });
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
      await resize(uri);
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

AttachmentService.publishVideo = async function (id) {
  await VideoModel.findByIdAndUpdate(id, { isProcessing: true });
};

AttachmentService.loadRenderedVideo = async function (id, host) {
  try {
    const file = `${id}.mp4`;
    const url = host + file;
    console.log(`${file} is being loaded from ${host} !`);
    const mimeType = file.substring(file.lastIndexOf('.'));
    const parentId = file.substring(0, file.lastIndexOf('.') - 1);
    const date = new Date();
    const videoName = `/video/${date.getUTCFullYear()}/${(date.getUTCMonth() + 1)}/${crypto.createHash('md5').update(file + uniqid()).digest('hex')}${mimeType}`;
    const fileName = path.join(__dirname, '../../../static/', videoName);
    downloadFileHttp(url, fileName).then(async (fileDest) => {
      const video = await VideoModel.create({
        name: file,
        parentId,
        url: videoName,
        privacy: 0
      });
      const trip = await TripModel.findByIdAndUpdate(id, { recentExportedVideo: video.url, exporting: false });
      const item = await FeedModel.create({
        fromId: trip.exporter,
        toId: id,
        privacy: 0,
        type: 3, // video
        attachments: [video.id]
      });
      await NotificationService.notify(trip.exporter, id, item.id, NotificationService.Type.POST);
      console.log(`${file} has been loaded from ${host} !`);
    });
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal error']
    };
  }
};

export default AttachmentService;
