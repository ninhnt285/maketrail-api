import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType,
  GraphQLInt
} from 'graphql';

import { nodeInterface } from '../utils/nodeDefinitions';
import LocalityType from './locality';
import { localityVenueConnection } from '../connections/localityVenue';
import { recommendVenueConnection } from '../connections/venue';

const TripLocalityType = new GraphQLObjectType({
  name: 'TripLocality',

  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    originLocality: {
      type: LocalityType
    },
    arrivalTime: {
      type: GraphQLInt
    },
    localityVenues: localityVenueConnection,
    recommendVenues: recommendVenueConnection
  },

  interfaces: [nodeInterface]
});

export default TripLocalityType;
