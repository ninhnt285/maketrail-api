import {
  GraphQLUnionType
} from 'graphql';
import { Type, getType } from '../../../lib/idUtils';

const TripType = require('../trip').default;
const UserType = require('../user').default;

const resolveType = (data) => {
  const type = getType(data.id);

  if (type === Type.USER) {
    return UserType;
  }

  if (type === Type.TRIP) {
    return TripType;
  }
};

const FeedTargetType = new GraphQLUnionType({
  name: 'FeedTargetType',
  types: [TripType, UserType],
  resolveType
});

export default FeedTargetType;
