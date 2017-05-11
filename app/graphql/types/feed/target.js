import {
  GraphQLUnionType
} from 'graphql';
import { Type, getType } from '../../../lib/idUtils';

const FeedPreviewType = require('./preview').default;
const TripPreviewType = require('./trip').default;
const UserPreviewType = require('./user').default;

const resolveType = (data) => {
  const type = getType(data.id);

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
  types: [FeedPreviewType, UserPreviewType, TripPreviewType],
  resolveType
});

export default FeedTargetType;
