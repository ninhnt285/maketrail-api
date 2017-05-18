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
import { Type, getType } from '../../lib/idUtils';

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
    let likes = [];
    if (!parentId) {
      likes = await LikeModel.find({}).exec();
    } else {
      likes = await LikeModel.find({ parentId }).exec();
    }

    return connectionFromArray(likes, args);
  }
};

export {
  LikeEdge,
  likeConnection
};
