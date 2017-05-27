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
    if (!userId){
      // eslint-disable-next-line no-param-reassign
      userId = user.id;
    }
    const notificationEdges = await connectionFromModel(NotificationModel,
      {
        user,
        ...args,
        filter: { userId }
      },
      null
    );

    return notificationEdges;
  }
};

export {
  NotificationEdge,
  notificationConnection
};
