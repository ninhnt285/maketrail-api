import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList
} from 'graphql';

import { nodeInterface } from '../utils/nodeDefinitions';
import LocalityType from './locality';
import GuestHouseType from './place/guestHouse';
import { localityVenueConnection } from '../connections/localityVenue';
import { recommendVenueConnection } from '../connections/venue';
import LocalityService from '../../database/helpers/locality';

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
    weatherIcon: {
      type: GraphQLString
    },
    localityVenues: localityVenueConnection,
    recommendVenues: recommendVenueConnection,
    recommendGuesthouses: {
      type: new GraphQLList(GuestHouseType),
      resolve: async obj => await LocalityService.searchGuesthouse(obj.id)
    }
  },

  interfaces: [nodeInterface]
});

export default TripLocalityType;
