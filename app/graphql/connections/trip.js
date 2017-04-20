import {
  GraphQLNonNull
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay';

import TripType from '../types/trip';
import TripModel from '../../database/models/trip';
import UserTripRelation from '../../database/models/userTripRelation';
import { connectionFromModel } from '../../database/helpers/connection';
import { connectionFromArray } from '../../lib/connection';
import { getType, Type } from '../../lib/idUtils';

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
    if (!user) {
      return connectionFromArray([], args);
    }

    let userId = user.id;

    try {
      if (getType(id) === Type.USER) {
        userId = id;
      }
    } catch (e) {
      console.log(e);
    }

    const tripEdges = await connectionFromModel(UserTripRelation,
      {
        user,
        ...args,
        filter: { userId }
      },
      async (r) => {
        const trip = await TripModel.findById(r.tripId).exec();
        return trip;
      }
    );

    return tripEdges;
  }
};

export {
  TripEdge,
  tripConnection
};
