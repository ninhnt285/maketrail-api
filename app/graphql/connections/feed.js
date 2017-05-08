import {
  GraphQLNonNull
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
    ...connectionArgs
  },

  resolve: async ({ id }, { ...args }, { user }) => {
    if (!user) {
      return connectionFromArray([], args);
    }

    const feeds = await FeedModel.find({}).exec();

    return connectionFromArray(feeds, args);
  }
};

export {
  FeedEdge,
  feedConnection
};
