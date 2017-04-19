import {
  GraphQLNonNull
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay';

import TripType from '../types/trip';
import TripModel from '../../database/models/trip';
import { connectionFromModel } from '../../database/helpers/connection';
import { connectionFromArray } from '../../lib/connection';

const {
  connectionType: TripConnection,
  edgeType: TripEdge,
} = connectionDefinitions({
  name: 'Trip',
  nodeType: TripType,
});

const tripConnection = {
  type: new GraphQLNonNull(TripConnection),

  args: {
    ...connectionArgs
  },

  resolve: async ({ id }, { ...args }, { user }) => {
    if (id && user) {
      const trips = await connectionFromModel(TripModel,
        {
          ...args,
          user,
          filter: { parentId: id }
        }
      );

      return trips;
    }

    return connectionFromArray([], args);
  }
};

export {
  TripEdge,
  tripConnection
};
