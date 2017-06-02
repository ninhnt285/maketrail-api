import {
  GraphQLNonNull,
  GraphQLString
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay';

import TripType from '../types/trip';
import TripModel from '../../database/models/trip';
import TripService from '../../database/helpers/trip';
import FeedService from '../../database/helpers/feed';
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

const tripExploreConnection = {
  type: new GraphQLNonNull(TripConnection),

  args: {
    ...connectionArgs,
    category: {
      type: GraphQLString
    },
    localityId: {
      type: GraphQLString
    }
  },

  resolve: async ({ id }, { ...args, category, localityId }, { user }) => {
    if (!user) {
      return connectionFromArray([], args);
    }

    const userId = user.id;

    const tmpTrips = await TripModel.find({ userId: { $ne: userId }, privacy: 0 }).exec();
    const trips = [];
    for (let i = 0; i < tmpTrips.length; i++) {
      if (!(await TripService.isMember(userId, tmpTrips[i].id)) && !(await FeedService.isLiked(userId, tmpTrips[i].id))) {
        if (localityId) {
          if (await TripService.hasLocality(tmpTrips[i].id, localityId)) {
            if (category) {
              const categories = await TripService.getCategories(tmpTrips[i].id);
              if (categories.includes(category)) {
                trips.push(tmpTrips[i]);
              }
            } else {
              trips.push(tmpTrips[i]);
            }
          }
        } else if (category) {
          const categories = await TripService.getCategories(tmpTrips[i].id);
          if (categories.includes(category)) {
            trips.push(tmpTrips[i]);
          }
        } else {
          trips.push(tmpTrips[i]);
        }
      }
    }
    return connectionFromArray(trips, []);
  }
};

export {
  TripEdge,
  tripConnection,
  tripExploreConnection
};
