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
import VenueModel from '../../database/models/venue';
import LocalityVenueRelation from '../../database/models/localityVenueRelation';
import { connectionFromModel } from '../../database/helpers/connection';
import { connectionFromArray } from '../../lib/connection';
import { Type, getType } from '../../lib/idUtils';
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

const localityVenueConnection = {
  type: new GraphQLNonNull(VenueConnection),

  args: {
    ...connectionArgs,
  },

  resolve: async ({ id }, { ...args }, { user }) => {
    if (!user) {
      return connectionFromArray([], args);
    }
    if (getType(id) === Type.TRIP_LOCALITY) {
      const venueEdges = await connectionFromModel(LocalityVenueRelation,
        {
          user,
          ...args,
          filter: { tripLocalityId: id }
        },
        async (r) => {
          const venue = await VenueModel.findById(r.venueId).exec();
          return venue;
        }
      );
      return venueEdges;
    }

    return connectionFromArray([], []);
  }
};

export {
  VenueEdge,
  venueConnection,
  localityVenueConnection
};
