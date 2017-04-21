import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} from 'graphql';

import {
  mutationWithClientMutationId
} from 'graphql-relay';

import LocalityType from '../../types/locality';
import LocalityService from '../../../database/helpers/locality';
import { LocalityEdge } from '../../connections/locality';
import { edgeFromNode } from '../../../lib/connection';

const RemoveLocalityMutation = mutationWithClientMutationId({
  name: 'RemoveLocality',

  inputFields: {
    tripId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    localityId: {
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
    locality: {
      type: LocalityType,
      resolve: ({ item }) => item
    },
    edge: {
      type: LocalityEdge,
      resolve: ({ item }) => edgeFromNode(item)
    }
  },

  mutateAndGetPayload: async ({ tripId, localityId }, { user }) => {
    let errors = [];

    if (!user) {
      errors = [
        'Please login to remove locality.'
      ];
      return {
        success: false,
        errors
      };
    }

    const res = await LocalityService.remove(user, tripId, localityId);
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

export default RemoveLocalityMutation;
