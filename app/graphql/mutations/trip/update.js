import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean,
  GraphQLString,
  GraphQLList
} from 'graphql';

import {
  mutationWithClientMutationId
} from 'graphql-relay';

import TripService from '../../../database/helpers/trip';
import TripType from '../../types/trip';
import { TripEdge } from '../../connections/trip';
import { edgeFromNode } from '../../../lib/connection';

const UpdateTripMutation = mutationWithClientMutationId({
  name: 'UpdateTrip',

  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: GraphQLString
    },
    exportedVideo: {
      type: GraphQLBoolean
    }
  },

  outputFields: {
    success: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ success }) => success
    },
    errors: {
      type: new GraphQLList(GraphQLString),
      resolve: ({ errors }) => errors
    },
    trip: {
      type: TripType,
      resolve: ({ item }) => item
    },
    edge: {
      type: TripEdge,
      resolve: ({ item }) => edgeFromNode(item)
    }
  },

  mutateAndGetPayload: async ({ id, ...args }, { user }) => {
    const newArgs = Object.assign({}, args);
    delete newArgs.clientMutationId;
    const res = await TripService.update(user, id, newArgs);
    if (res.errors) {
      return {
        success: false,
        errors: res.errors
      };
    }
    return {
      success: true,
      item: res.item
    };
  }
});

export default UpdateTripMutation;
