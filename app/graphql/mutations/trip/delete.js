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

const DeleteTripMutation = mutationWithClientMutationId({
  name: 'DeleteTrip',

  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
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

  mutateAndGetPayload: async ({ id }, { user }) => {
    const res = await TripService.delete(user, id);
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

export default DeleteTripMutation;
