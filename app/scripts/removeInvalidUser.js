/* eslint-disable global-require */
/**
 * Created by hoangtran on 5/15/2017.
 */
import UserModel from '../database/models/user';
import connectDb from '../database/connectDb';

async function onConnected() {
  await UserModel.remove({ username: undefined });
  console.log('done');
}

connectDb(onConnected);

