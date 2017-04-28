import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType,
} from 'graphql';

import { nodeInterface } from '../utils/nodeDefinitions';
import LocalityType from './locality';
import { localityVenueConnection } from '../connections/venue';

const TripLocalityType = new GraphQLObjectType({
  name: 'TripLocality',

  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    originLocality: {
      type: LocalityType
    },
    tripVenues: localityVenueConnection
  },

  interfaces: [nodeInterface]
});

export default TripLocalityType;
