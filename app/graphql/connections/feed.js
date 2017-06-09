import {
  GraphQLNonNull,
  GraphQLID
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay';

import FeedType from '../types/feed';
import FeedModel from '../../database/models/feed';
import UserService from '../../database/helpers/user';
import { connectionFromArray } from '../../lib/connection';
import { connectionFromModel } from '../../database/helpers/connection';

const {
  connectionType: FeedConnection,
  edgeType: FeedEdge,
} = connectionDefinitions({
  name: 'Feed',
  nodeType: FeedType,
});

const feedConnection = {
  type: new GraphQLNonNull(FeedConnection),

  args: {
    ...connectionArgs,
    toId: {
      type: GraphQLID
    }
  },

  resolve: async ({ id }, { ...args, toId }, { user }) => {
    if (!user) {
      return connectionFromArray([], args);
    }
    let feedEdges = [];
    // eslint-disable-next-line no-param-reassign
    args.sort = '-createdAt';
    if (!toId) {
      const subjects = await UserService.getFolloweds(user.id);
      feedEdges = await connectionFromModel(FeedModel,
        {
          user,
          ...args,
          filter: { $or: [{ fromId: { $in: subjects } }, { toId: user.id }] }
        },
        null
      );
    } else {
      feedEdges = await connectionFromModel(FeedModel,
        {
          user,
          ...args,
          filter: { toId }
        },
        null
      );
    }

    return feedEdges;
  }
};

export {
  FeedEdge,
  feedConnection
};
