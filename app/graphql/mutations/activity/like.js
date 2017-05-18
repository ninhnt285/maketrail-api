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

import LikeType from '../../types/like';
import FeedService from '../../../database/helpers/feed';
import { LikeEdge } from '../../connections/like';
import { edgeFromNode } from '../../../lib/connection';

const LikeMutation = mutationWithClientMutationId({
  name: 'AddLike',

  inputFields: {
    parentId: {
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
    like: {
      type: LikeType,
      resolve: ({ item }) => item
    },
    edge: {
      type: LikeEdge,
      resolve: ({ item }) => edgeFromNode(item)
    }
  },

  mutateAndGetPayload: async ({ parentId }, { user }) => {
    let errors = [];

    if (!user) {
      errors = [
        'Please login to add new feed.'
      ];
      return {
        success: false,
        errors
      };
    }

    const res = await FeedService.like(user, parentId);
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

export default LikeMutation;
