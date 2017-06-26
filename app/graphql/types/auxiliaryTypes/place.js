import {
  GraphQLUnionType
} from 'graphql';
import { Type, getType } from '../../../lib/idUtils';

const VenueType = require('./../venue').default;
const LocalityType = require('./../locality').default;

const resolveType = (data) => {
  const type = getType(data.id);

  if (type === Type.VENUE) {
    return VenueType;
  }

  if (type === Type.LOCALITY) {
    return LocalityType;
  }

};

const PlaceType = new GraphQLUnionType({
  name: 'PlaceType',
  types: [VenueType, LocalityType],
  resolveType
});

export default PlaceType;
