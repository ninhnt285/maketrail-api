import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean,
  GraphQLString,
  GraphQLList
} from 'graphql';

import {
  mutationWithClientMutationId
} from 'graphql-relay';

import CommentService from '../../../database/helpers/comment';
import CommentType from '../../types/comment';
import { CommentEdge } from '../../connections/comment';
import { edgeFromNode } from '../../../lib/connection';
import viewer from '../../queries/viewer';

const DeleteCommentMutation = mutationWithClientMutationId({
  name: 'DeleteComment',

  inputFields: {
    id: {
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
    comment: {
      type: CommentType,
      resolve: ({ item }) => item
    },
    edge: {
      type: CommentEdge,
      resolve: ({ item }) => edgeFromNode(item)
    },
    deletedId: {
      type: GraphQLID,
      resolve: ({ deletedId }) => deletedId
    },
    viewer
  },

  mutateAndGetPayload: async ({ id }, { user }) => {
    const res = await CommentService.delete(user, id);
    if (res.errors) {
      return {
        success: false,
        errors: res.errors
      };
    }
    return {
      success: true,
      item: res.item,
      deletedId: id
    };
  }
});

export default DeleteCommentMutation;
