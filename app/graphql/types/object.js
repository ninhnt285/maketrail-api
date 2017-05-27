import {
  GraphQLUnionType
} from 'graphql';
import { Type, getType } from '../../lib/idUtils';

const TripType = require('./trip').default;
const UserType = require('./user').default;
const CommentType = require('./comment').default;
const FeedType = require('./feed').default;
const PhotoType = require('./photo').default;
const VideoType = require('./video').default;

const resolveType = (data) => {
  const type = getType(data.id);

  if (type === Type.USER) {
    return UserType;
  }

  if (type === Type.TRIP) {
    return TripType;
  }

  if (type === Type.COMMENT) {
    return CommentType;
  }

  if (type === Type.FEED) {
    return FeedType;
  }

  if (type === Type.PHOTO) {
    return PhotoType;
  }

  if (type === Type.VIDEO) {
    return VideoType;
  }
};

const ObjectType = new GraphQLUnionType({
  name: 'ObjectType',
  types: [TripType, UserType, CommentType, FeedType, PhotoType, VideoType],
  resolveType
});

export default ObjectType;
