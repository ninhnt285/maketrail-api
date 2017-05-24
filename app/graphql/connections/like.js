import {
  GraphQLNonNull,
  GraphQLID
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay';

import LikeType from '../types/like';
import LikeModel from '../../database/models/like';
import { connectionFromArray } from '../../lib/connection';
import { connectionFromModel } from '../../database/helpers/connection';

const {
  connectionType: LikeConnection,
  edgeType: LikeEdge,
} = connectionDefinitions({
  name: 'Like',
  nodeType: LikeType,
});

const likeConnection = {
  type: new GraphQLNonNull(LikeConnection),

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
    let likeEdges = [];
    if (!parentId) {
      likeEdges = await connectionFromModel(LikeModel,
        {
          user,
          ...args,
          filter: { }
        },
        null
      );
    } else {
      likeEdges = await connectionFromModel(LikeModel,
        {
          user,
          ...args,
          filter: { parentId }
        },
        null
      );
    }

    return likeEdges;
  }
};

export {
  LikeEdge,
  likeConnection
};
