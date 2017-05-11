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

import FeedType from '../../types/feed';
import FeedService from '../../../database/helpers/feed';
import { FeedEdge } from '../../connections/feed';
import { edgeFromNode } from '../../../lib/connection';

const PostMutation = mutationWithClientMutationId({
  name: 'AddPost',

  inputFields: {
    objectId: {
      type: GraphQLID
    },
    text: {
      type: GraphQLString
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
    feed: {
      type: FeedType,
      resolve: ({ item }) => item
    },
    edge: {
      type: FeedEdge,
      resolve: ({ item }) => edgeFromNode(item)
    }
  },

  mutateAndGetPayload: async ({ objectId, text }, { user }) => {
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

    const res = await FeedService.post(user, objectId, text, []);
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

export default PostMutation;