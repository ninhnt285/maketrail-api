import UserModel from '../models/user';
import TripModel from '../models/trip';
import FeedModel from '../models/feed';
import { getType, Type } from '../../lib/idUtils';

function getModelFromType(type) {
  switch (type) {
    case Type.USER:
      return UserModel;
    case Type.TRIP:
      return TripModel;
    case Type.FEED:
      return FeedModel;
    default:
      return null;
  }
}

export async function getNodeFromId(globalId, user = null) {
  const type = getType(globalId);
  const model = getModelFromType(type);
  let res = null;
  if (model) {
    try {
      res = await model.findById(globalId);
    } catch (e) {
      console.log(e);
    }
  }
  return res;
}

