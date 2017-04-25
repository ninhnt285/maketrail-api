import {
  GraphQLNonNull,
  GraphQLString
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay';

import LocalityType from '../types/locality';
import LocalityModel from '../../database/models/locality';
import TripLocalityRelation from '../../database/models/tripLocalityRelation';
import { connectionFromModel } from '../../database/helpers/connection';
import { connectionFromArray } from '../../lib/connection';
import { Type, getType } from '../../lib/idUtils';
import LocalityService from '../../database/helpers/locality';

const {
  connectionType: LocalityConnection,
  edgeType: LocalityEdge,
} = connectionDefinitions({
  name: 'Locality',
  nodeType: LocalityType,
});

const localityConnection = {
  type: new GraphQLNonNull(LocalityConnection),

  args: {
    ...connectionArgs,
    query: {
      type: GraphQLString
    }
  },

  resolve: async ({ id }, { ...args, query }, { user }) => {
    if (!user) {
      return connectionFromArray([], args);
    }
    if (getType(id) === Type.TRIP) {
      const localityEdges = await connectionFromModel(TripLocalityRelation,
        {
          user,
          ...args,
          filter: { tripId: id }
        },
        async (r) => {
          const locality = await LocalityModel.findById(r.localityId).exec();
          locality.cursor = r.id;
          return locality;
        }
      );
      return localityEdges;
    }
    if (query) {
      const localities = await LocalityService.seachLocality(query);
      if (localities) return connectionFromArray(localities, []);
    }

    return connectionFromArray([], []);
  }
};

export {
  LocalityEdge,
  localityConnection
};
