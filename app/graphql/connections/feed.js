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
import NotificationModel from '../../database/models/notification';
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
    if (!toId) {
      const notifications = (await NotificationModel.find({ fromId: user.id })).map(r => r.toId);
      feedEdges = await connectionFromModel(FeedModel,
        {
          user,
          ...args,
          filter: { toId: { $in: notifications } }
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
