import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} from 'graphql';

import {
  mutationWithClientMutationId
} from 'graphql-relay';

import TripLocalityType from '../../types/tripLocality';
import LocalityService from '../../../database/helpers/locality';
import { TripLocalityEdge } from '../../connections/tripLocality';
import { edgeFromNode } from '../../../lib/connection';

const AddTripLocalityMutation = mutationWithClientMutationId({
  name: 'AddTripLocality',

  inputFields: {
    tripId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    localityId: {
      type: new GraphQLNonNull(GraphQLString)
    },
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
    tripLocality: {
      type: TripLocalityType,
      resolve: ({ item }) => item
    },
    edge: {
      type: TripLocalityEdge,
      resolve: ({ item }) => edgeFromNode(item)
    }
  },

  mutateAndGetPayload: async ({ tripId, localityId }, { user }) => {
    let errors = [];

    if (!user) {
      errors = [
        'Please login to add new tripLocality.'
      ];
      return {
        success: false,
        errors
      };
    }

    const res = await LocalityService.add(user, tripId, localityId);
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

export default AddTripLocalityMutation;
