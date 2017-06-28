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

const UpdateFeedMutation = mutationWithClientMutationId({
  name: 'UpdateFeed',

  inputFields: {

    feedId: {
      type: new GraphQLNonNull(GraphQLID)
    },
    text: {
      type: GraphQLString
    },

    placeId: {
      type: GraphQLID
    },
    placeName: {
      type: GraphQLString
    },

    attachmentIds: {
      type: new GraphQLList(GraphQLID)
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

  mutateAndGetPayload: async ({ feedId, ...args }, { user }) => {
    const newArgs = Object.assign({}, args);
    delete newArgs.clientMutationId;
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

    const res = await FeedService.update(user, feedId, newArgs);
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

export default UpdateFeedMutation;
