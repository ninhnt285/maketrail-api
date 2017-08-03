import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLBoolean,
  GraphQLString
} from 'graphql';

import {
  mutationWithClientMutationId
} from 'graphql-relay';

import UserType from '../../types/user';
import FriendshipService from '../../../database/helpers/friendship';
import { UserEdge } from '../../connections/user';
import { edgeFromNode } from '../../../lib/connection';

const UnfriendMutation = mutationWithClientMutationId({
  name: 'Unfriend',

  inputFields: {
    userId: {
      type: new GraphQLNonNull(GraphQLID)
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
    user: {
      type: UserType,
      resolve: ({ item }) => item
    },
    edge: {
      type: UserEdge,
      resolve: ({ item }) => edgeFromNode(item)
    }
  },

  mutateAndGetPayload: async ({ userId }, { user }) => {
    let errors = [];

    if (!user) {
      errors = [
        'Please login to unfriend.'
      ];
      return {
        success: false,
        errors
      };
    }

    const res = await FriendshipService.unFriend(user.id, userId);
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

export default UnfriendMutation;
