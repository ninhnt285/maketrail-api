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

const UpdateCommentMutation = mutationWithClientMutationId({
  name: 'UpdateComment',

  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    text: {
      type: GraphQLString
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
    comment: {
      type: CommentType,
      resolve: ({ item }) => item
    },
    edge: {
      type: CommentEdge,
      resolve: ({ item }) => edgeFromNode(item)
    }
  },

  mutateAndGetPayload: async ({ id, ...args }, { user }) => {
    const newArgs = Object.assign({}, args);
    delete newArgs.clientMutationId;
    const res = await CommentService.update(user, id, newArgs);
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

export default UpdateCommentMutation;
