import {
  GraphQLNonNull
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
    ...connectionArgs
  },

  resolve: async ({ id }, { ...args }, { user }) => {
    if (!user) {
      return connectionFromArray([], args);
    }

    const localityEdges = await connectionFromModel(TripLocalityRelation,
      {
        user,
        ...args,
        filter: { tripId: id }
      },
      async (r) => {
        const locality = await LocalityModel.findById(r.localityId).exec();
        return locality;
      }
    );

    return localityEdges;
  }
};

export {
  LocalityEdge,
  localityConnection
};
