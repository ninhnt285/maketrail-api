import {
  GraphQLUnionType
} from 'graphql';
import { Type, getType } from '../../../lib/idUtils';

const AttachmentType = require('./../attachment').default;
const FeedPreviewType = require('./preview').default;
const TripPreviewType = require('./trip').default;
const UserPreviewType = require('./user').default;

const resolveType = (data) => {
  const type = getType(data.id);
  if (type === Type.ITEM) {
    return AttachmentType;
  }

  if (type === Type.FEED) {
    return FeedPreviewType;
  }

  if (type === Type.USER) {
    return UserPreviewType;
  }

  if (type === Type.TRIP) {
    return TripPreviewType;
  }
};

const FeedTargetType = new GraphQLUnionType({
  name: 'FeedTargetType',
  types: [AttachmentType, FeedPreviewType, UserPreviewType, TripPreviewType],
  resolveType
});

export default FeedTargetType;
