/* eslint-disable no-param-reassign */
import {
  GraphQLNonNull,
  GraphQLID
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay';

import RequestType from '../types/request';
import UserModel from '../../database/models/user';
import FriendshipModel from '../../database/models/friendship';
import { connectionFromArray } from '../../lib/connection';
import { connectionFromModel } from '../../database/helpers/connection';

const {
  connectionType: RequestConnection,
  edgeType: RequestEdge,
} = connectionDefinitions({
  name: 'Request',
  nodeType: RequestType,
});

const requestConnection = {
  type: new GraphQLNonNull(RequestConnection),

  args: {
    ...connectionArgs,
    userId: {
      type: GraphQLID
    }
  },

  resolve: async ({ id }, { ...args, userId }, { user }) => {
    if (!user && !userId) {
      return connectionFromArray([], args);
    }
    if (!userId) {
      userId = user.id;
    }
    args.sort = '-createdAt';
    const requestEdges = await connectionFromModel(FriendshipModel,
      {
        user,
        ...args,
        filter: { user2: userId, isSentRequest: true }
      },
      async (r) => {
        const from = await UserModel.findById(r.user1);
        const request = {};
        request.id = r.id;
        request.userId = r.user1;
        request.name = from.fullName || from.username;
        request.link = `/profile/${r.user1}`;
        request.previewImage = from.profilePicUrl;
        return request;
      }
    );
    return requestEdges;
  }
};

export {
  RequestEdge,
  requestConnection
};
