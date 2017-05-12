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
import { Type, getType } from '../../lib/idUtils';

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
    parentId: {
      type: GraphQLID
    }
  },

  resolve: async ({ id }, { ...args, parentId }, { user }) => {
    if (!user) {
      return connectionFromArray([], args);
    }
    let feeds = [];
    if (!parentId) {
      feeds = await FeedModel.find({}).exec();
    } else {
      const type = getType(parentId);
      if (type === Type.USER) {
        feeds = await FeedModel.find({ $or: [{ objectId: parentId }, { userId: parentId, type: 2 }] }).exec();
      } else if (type === Type.TRIP) {
        feeds = await FeedModel.find({ objectId: parentId }).exec();
      }
    }

    return connectionFromArray(feeds, args);
  }
};

const feedTripConnection = {
  type: new GraphQLNonNull(FeedConnection),

  args: {
    ...connectionArgs,
  },

  resolve: async ({ id }, { ...args }, { user }) => {
    if (!user) {
      return connectionFromArray([], args);
    }
    let feeds = [];
    const type = getType(id);
    if (type === Type.TRIP) {
      feeds = await FeedModel.find({ objectId: id }).exec();
    }

    return connectionFromArray(feeds, args);
  }
};

export {
  FeedEdge,
  feedConnection,
  feedTripConnection
};
