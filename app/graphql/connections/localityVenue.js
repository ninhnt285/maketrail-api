import {
  GraphQLNonNull,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay';

import LocalityVenueType from '../types/localityVenue';
import VenueModel from '../../database/models/venue';
import LocalityVenueRelation from '../../database/models/localityVenueRelation';
import { connectionFromModel } from '../../database/helpers/connection';
import { connectionFromArray } from '../../lib/connection';
import { Type, getType } from '../../lib/idUtils';

const {
  connectionType: LocalityVenueConnection,
  edgeType: LocalityVenueEdge,
} = connectionDefinitions({
  name: 'LocalityVenue',
  nodeType: LocalityVenueType,
});

const localityVenueConnection = {
  type: new GraphQLNonNull(LocalityVenueConnection),

  args: {
    ...connectionArgs,
  },

  resolve: async ({ id }, { ...args }, { user }) => {
    if (!user) {
      return connectionFromArray([], args);
    }
    if (getType(id) === Type.TRIP_LOCALITY) {
      const localityVenueEdges = await connectionFromModel(LocalityVenueRelation,
        {
          user,
          ...args,
          filter: { tripLocalityId: id }
        },
        async (r) => {
          const localityVenue = await VenueModel.findById(r.venueId).exec();
          return {
            id: r.id,
            originVenue: localityVenue
          };
        }
      );
      return localityVenueEdges;
    }

    return connectionFromArray([], []);
  }
};

export {
  LocalityVenueEdge,
  localityVenueConnection,
};
