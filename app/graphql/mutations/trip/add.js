import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} from 'graphql';

import {
  mutationWithClientMutationId
} from 'graphql-relay';

import TripType from '../../types/trip';
import TripService from '../../../database/helpers/trip';
import { TripEdge } from '../../connections/trip';
import { edgeFromNode } from '../../../lib/connection';

const AddTripMutation = mutationWithClientMutationId({
  name: 'AddTrip',

  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
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

  mutateAndGetPayload: async ({ name }, { user }) => {
    let errors = [];

    if (!user) {
      errors = [
        'Please login to add new trip.'
      ];
      return {
        success: false,
        errors
      };
    }

    const res = await TripService.add(user, { name, userId: user.id });
    if (res.errors) {
      return {
        success: false,
        errors
      };
    }
    return {
      success: true,
      item: res.item
    };
  }
});

export default AddTripMutation;
