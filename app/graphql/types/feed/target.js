import {
  GraphQLUnionType
} from 'graphql';
import { Type, getType } from '../../../lib/idUtils';

const ItemType = require('./../item').default;
const FeedPreviewType = require('./preview').default;
const TripPreviewType = require('./trip').default;
const UserPreviewType = require('./user').default;

const resolveType = (data) => {
  const type = getType(data.id);
  if (type === Type.ITEM) {
    return ItemType;
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
  types: [ItemType, FeedPreviewType, UserPreviewType, TripPreviewType],
  resolveType
});

export default FeedTargetType;
