import path from 'path';
import fs from 'fs';
import AttachmentService from '../../database/helpers/attachment';
import { resize } from '../google/place/photo';

const spawn = require('child_process').spawn;
const spawnSync = require('child_process').spawnSync;

export async function convertToMp4(id, inputPath) {
  const outputPath = `${inputPath}_tmp`;
  fs.renameSync(inputPath, outputPath);
  const child = spawn('ffmpeg', ['-y', '-i', outputPath, '-s', '1280x720', '-c:v', 'libx264', '-crf', '23', inputPath]);
  child.on('exit', () => {
    fs.unlink(outputPath);
    AttachmentService.publishVideo(id);
  });
}

export async function extractPreviewImage(videoUri, imageUri) {
  const inputPath = path.join(__dirname, '../../../static/', videoUri);
  const outputPath = path.join(__dirname, '../../../static/', imageUri);
  const child = spawnSync('ffmpeg', ['-y', '-i', inputPath, '-ss', '00:00:05', '-f', 'image2', '-vframes', '1', '-s', '1280x720', outputPath]);
  await resize(imageUri);
}

export async function processVideo(id, videoUri) {
  const videoFile = path.join(__dirname, '../../../static/', videoUri);
  convertToMp4(id, videoFile);
}
