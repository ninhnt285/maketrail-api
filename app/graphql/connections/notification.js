/* eslint-disable no-param-reassign */
import {
  GraphQLNonNull,
  GraphQLID
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay';

import NotificationType from '../types/notification';
import NotificationModel from '../../database/models/notification';
import { connectionFromArray } from '../../lib/connection';
import { connectionFromModel } from '../../database/helpers/connection';

const {
  connectionType: NotificationConnection,
  edgeType: NotificationEdge,
} = connectionDefinitions({
  name: 'Notification',
  nodeType: NotificationType,
});

const notificationConnection = {
  type: new GraphQLNonNull(NotificationConnection),

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
    const notificationEdges = await connectionFromModel(NotificationModel,
      {
        user,
        ...args,
        filter: { userId }
      },
      async (r) => {
        const notification = await NotificationModel.findByIdAndUpdate(r.id, { isRead: true }).exec();
        return notification;
      }
    );
    return notificationEdges;
  }
};

export {
  NotificationEdge,
  notificationConnection
};
