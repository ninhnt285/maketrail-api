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
import { connectionFromModel } from '../../database/helpers/connection';

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
    let commentEdges = [];
    if (!parentId) {
      commentEdges = await connectionFromModel(CommentModel,
        {
          user,
          ...args,
          filter: { parentId: id }
        },
        null
      );
    } else {
      commentEdges = await connectionFromModel(CommentModel,
        {
          user,
          ...args,
          filter: { parentId }
        },
        null
      );
    }

    return commentEdges;
  }
};

export {
  CommentEdge,
  commentConnection
};
