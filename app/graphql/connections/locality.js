import {
  GraphQLNonNull,
  GraphQLString
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay';

import LocalityType from '../types/locality';
import { connectionFromArray } from '../../lib/connection';
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
    if (query) {
      const localities = await LocalityService.seachLocality(query);
      if (localities) return connectionFromArray(localities, args);
    }

    return connectionFromArray([], []);
  }
};

export {
  LocalityEdge,
  localityConnection
};
