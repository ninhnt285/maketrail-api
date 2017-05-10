import {
  GraphQLUnionType
} from 'graphql';
import { Type, getType } from '../../../lib/idUtils';

const ItemType = require('./../item').default;
const FeedPreviewType = require('./preview').default;

const resolveType = (data) => {
  const type = getType(data.id);
  if (type === Type.ITEM) {
    return ItemType;
  }

  if (type === Type.FEED) {
    return FeedPreviewType;
  }
};

const FeedTargetType = new GraphQLUnionType({
  name: 'FeedTargetType',
  types: [ItemType, FeedPreviewType],
  resolveType
});

export default FeedTargetType;
