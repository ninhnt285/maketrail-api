import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} from 'graphql';

import {
  mutationWithClientMutationId
} from 'graphql-relay';

import LocalityService from '../../../database/helpers/locality';
import TripLocalityType from '../../types/tripLocality';
import { TripLocalityEdge } from '../../connections/tripLocality';
import { edgeFromNode } from '../../../lib/connection';

const UpdateTripLocalityMutation = mutationWithClientMutationId({
  name: 'UpdateTripLocality',

  inputFields: {
    tripId: {
      type: new GraphQLNonNull(GraphQLID)
    },
    tripLocalityId: {
      type: new GraphQLNonNull(GraphQLID)
    },
    arrivalTime: {
      type: GraphQLInt
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
    tripLocality: {
      type: TripLocalityType,
      resolve: ({ item }) => item
    },
    edge: {
      type: TripLocalityEdge,
      resolve: ({ item }) => edgeFromNode(item)
    }
  },

  mutateAndGetPayload: async ({ tripId, tripLocalityId, ...args }, { user }) => {
    const newArgs = Object.assign({}, args);
    delete newArgs.clientMutationId;
    const res = await LocalityService.updateTripLocality(user, tripId, tripLocalityId, newArgs);
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

export default UpdateTripLocalityMutation;
