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
import viewer from '../../queries/viewer';

const DeleteFeedMutation = mutationWithClientMutationId({
  name: 'DeleteFeed',

  inputFields: {

    feedId: {
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
    feed: {
      type: FeedType,
      resolve: ({ item }) => item
    },
    edge: {
      type: FeedEdge,
      resolve: ({ item }) => edgeFromNode(item)
    },
    deletedId: {
      type: GraphQLID,
      resolve: ({ deletedId }) => deletedId
    },
    viewer
  },

  mutateAndGetPayload: async ({ feedId }, { user }) => {
    let errors = [];

    if (!user) {
      errors = [
        'Please login to edit feed.'
      ];
      return {
        success: false,
        errors
      };
    }

    const res = await FeedService.delete(user, feedId);
    if (res.errors) {
      return {
        success: false,
        errors: res.errors
      };
    }
    return {
      success: true,
      item: res.item,
      deletedId: feedId
    };
  }
});

export default DeleteFeedMutation;
