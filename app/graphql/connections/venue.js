import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLList
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay';

import VenueType from '../types/venue';
import { connectionFromArray } from '../../lib/connection';
import VenueService from '../../database/helpers/venue';

const {
  connectionType: VenueConnection,
  edgeType: VenueEdge,
} = connectionDefinitions({
  name: 'Venue',
  nodeType: VenueType,
});

const venueConnection = {
  type: new GraphQLNonNull(VenueConnection),

  args: {
    ...connectionArgs,
    query: {
      type: GraphQLString
    },
    localityId: {
      type: GraphQLString
    },
    categoryFoursquareIds: {
      type: new GraphQLList(GraphQLString)
    }
  },

  resolve: async ({ id }, { ...args, query, localityId, categoryFoursquareIds }, { user }) => {
    if (!user) {
      return connectionFromArray([], args);
    }
    if (query) {
      const venues = await VenueService.seachVenue(localityId, query, categoryFoursquareIds);
      if (venues) return connectionFromArray(venues, args);
    }

    return connectionFromArray([], []);
  }
};

export {
  VenueEdge,
  venueConnection,
};
