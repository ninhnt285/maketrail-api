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
import { connectionFromArray } from '../../lib/connection';

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
    let feeds = [];
    if (!toId) {
      feeds = await FeedModel.find({ toId: id }).exec();
    } else {
      feeds = await FeedModel.find({ toId }).exec();
    }

    return connectionFromArray(feeds, args);
  }
};

export {
  FeedEdge,
  feedConnection
};
