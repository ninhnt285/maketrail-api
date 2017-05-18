import {
  GraphQLNonNull,
  GraphQLID
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay';

import CommentType from '../types/comment';
import CommentModel from '../../database/models/comment';
import { connectionFromArray } from '../../lib/connection';

const {
  connectionType: CommentConnection,
  edgeType: CommentEdge,
} = connectionDefinitions({
  name: 'Comment',
  nodeType: CommentType,
});

const commentConnection = {
  type: new GraphQLNonNull(CommentConnection),

  args: {
    ...connectionArgs,
    parentId: {
      type: GraphQLID
    }
  },

  resolve: async ({ id }, { ...args, parentId }, { user }) => {
    if (!user) {
      return connectionFromArray([], args);
    }
    let comments = [];
    if (!parentId) {
      comments = await CommentModel.find({ parentId: id }).exec();
    } else {
      comments = await CommentModel.find({ parentId }).exec();
    }

    return connectionFromArray(comments, args);
  }
};

export {
  CommentEdge,
  commentConnection
};
