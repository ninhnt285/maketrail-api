import {
  GraphQLNonNull
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay';

import TripLocalityType from '../types/tripLocality';
import LocalityModel from '../../database/models/locality';
import TripLocalityRelation from '../../database/models/tripLocalityRelation';
import { connectionFromModel } from '../../database/helpers/connection';
import { connectionFromArray } from '../../lib/connection';
import { Type, getType } from '../../lib/idUtils';

const {
  connectionType: TripLocalityConnection,
  edgeType: TripLocalityEdge,
} = connectionDefinitions({
  name: 'TripLocality',
  nodeType: TripLocalityType,
});

const localityConnection = {
  type: new GraphQLNonNull(TripLocalityConnection),

  args: {
    ...connectionArgs
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
          return {
            id: r.id,
            arrivalTime: r.arrivalTime,
            originLocality: locality
          };
        }
      );
      return localityEdges;
    }

    return connectionFromArray([], []);
  }
};

export {
  TripLocalityEdge,
  localityConnection
};
