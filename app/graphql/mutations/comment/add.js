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

import CommentType from '../../types/comment';
import CommentService from '../../../database/helpers/comment';
import { CommentEdge } from '../../connections/comment';
import { edgeFromNode } from '../../../lib/connection';

const CommentMutation = mutationWithClientMutationId({
  name: 'AddComment',

  inputFields: {
    parentId: {
      type: new GraphQLNonNull(GraphQLID)
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
    comment: {
      type: CommentType,
      resolve: ({ item }) => item
    },
    edge: {
      type: CommentEdge,
      resolve: ({ item }) => edgeFromNode(item)
    }
  },

  mutateAndGetPayload: async ({ parentId, text }, { user }) => {
    let errors = [];

    if (!user) {
      errors = [
        'Please login to comment.'
      ];
      return {
        success: false,
        errors
      };
    }

    const res = await CommentService.add(user, parentId, text);
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

export default CommentMutation;
