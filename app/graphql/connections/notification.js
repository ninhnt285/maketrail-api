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
import NotificationService from '../../database/helpers/notification';
import NotificationModel from '../../database/models/notification';
import UserModel from '../../database/models/user';
import FeedModel from '../../database/models/feed';
import LikeModel from '../../database/models/like';
import CommentModel from '../../database/models/comment';
import UserTripRelationModel from '../../database/models/userTripRelation';
import FriendshipModel from '../../database/models/friendship';
import { getType, Type } from '../../lib/idUtils';
import { getNodeFromId } from '../../database/helpers/node';
import { connectionFromArray } from '../../lib/connection';
import { connectionFromModel } from '../../database/helpers/connection';

const {
  connectionType: NotificationConnection,
  edgeType: NotificationEdge,
} = connectionDefinitions({
  name: 'Notification',
  nodeType: NotificationType,
});

function getText(type) {
  if (type === Type.COMMENT) {
    return 'comment';
  } else if (type === Type.PHOTO) {
    return 'photo';
  } else if (type === Type.VIDEO) {
    return 'video';
  } else if (type === Type.FEED) {
    return 'feed';
  } else if (type === Type.TRIP) {
    return 'trip';
  }
}

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
        const from = await UserModel.findById(notification.fromId);
        const type = await getType(notification.toId);
        let count = 1;
        let added = '';
        const date = new Date();
        date.setHours(date.getHours() - 72);
        if (notification.type === NotificationService.Type.POST) {
          count = await FeedModel.count({ toId: notification.toId, updatedAt: { $gt: date } });
          if (count > 1) added = ` and ${count - 1} other people`;
          if (notification.toId === userId) {
            notification.story = `${from.fullName}${added} posted to your Timeline.`;
          } else {
            const to = await getNodeFromId(notification.toId);
            notification.story = `${from.fullName}${added} posted to ${to.fullName ? to.fullName : to.name}'s Timeline.`;
          }
          notification.link = `/feed/${notification.sourceId}`;
          notification.previewImage = from.profilePicUrl;
        } else if (notification.type === NotificationService.Type.COMMENT) {
          const to = await getNodeFromId(notification.toId);
          count = await CommentModel.count({ parentId: notification.toId, updatedAt: { $gt: date } });
          if (count > 1) added = `and ${count - 1} other people`;
          if (type === Type.COMMENT && to.fromId !== userId) {
            notification.story = `${from.fullName}${added} commented to a conversation that you attended.`;
          } else {
            notification.story = `${from.fullName}${added} commented to your ${getText(type)}.`;
          }
          notification.link = `/${getText(type)}/${notification.toId}`;
          notification.previewImage = from.profilePicUrl;
        } else if (notification.type === NotificationService.Type.LIKE) {
          count = await LikeModel.count({ parentId: notification.toId, updatedAt: { $gt: date } });
          if (count > 1) added = `and ${count - 1} other people`;
          notification.story = `${from.fullName}${added} liked your ${getText(type)}.`;
          notification.link = `/${getText(type)}/${notification.toId}`;
          notification.previewImage = from.profilePicUrl;
        } else if (notification.type === NotificationService.Type.FOLLOW) {
          count = await FriendshipModel.count({ user2: userId, isFriend: false, isFollow: true, updatedAt: { $gt: date } });
          if (count > 1) added = `and ${count - 1} other people`;
          notification.story = `${from.fullName}${added} followed you.`;
          notification.link = `/user/${notification.fromId}`;
          notification.previewImage = from.profilePicUrl;
        } else if (notification.type === NotificationService.Type.ACCEPT_FRIEND) {
          count = await FriendshipModel.count({ user2: userId, isFriend: true, updatedAt: { $gt: date } });
          if (count > 1) added = `and ${count - 1} other people`;
          notification.story = `${from.fullName}${added} have become your friends.`;
          notification.link = `/user/${notification.fromId}`;
          notification.previewImage = from.profilePicUrl;
        } else if (notification.type === NotificationService.Type.ADD_LOCALITY) {
          const to = await getNodeFromId(notification.toId);
          notification.story = `${from.fullName}${added} add new locality you to ${to.name}.`;
          notification.link = `/trip/${notification.toId}`;
          notification.previewImage = to.previewPhotoUrl;
        } else if (notification.type === NotificationService.Type.PUBLISH_TRIP) {
          const to = await getNodeFromId(notification.toId);
          notification.story = `${from.fullName}${added} published ${to.name}.`;
          notification.link = `/feed/${notification.sourceId}`;
          notification.previewImage = to.previewPhotoUrl;
        } else if (notification.type === NotificationService.Type.EXPORT_VIDEO) {
          const to = await getNodeFromId(notification.toId);
          notification.story = `${from.fullName}${added} exported ${to.name}'s video.`;
          notification.link = `/feed/${notification.sourceId}`;
          notification.previewImage = to.previewPhotoUrl;
        } else if (notification.type === NotificationService.Type.JOIN_TRIP) {
          count = await UserTripRelationModel.count({ tripId: notification.toId, updatedAt: { $gt: date } });
          if (count > 1) added = `and ${count - 1} other people`;
          const to = await getNodeFromId(notification.toId);
          notification.story = `${from.fullName}${added} joined ${to.name}.`;
          notification.link = `/feed/${notification.sourceId}`;
          notification.previewImage = from.profilePicUrl;
        } else if (notification.type === NotificationService.Type.INVITE_TO_TRIP) {
          const source = await getNodeFromId(notification.sourceId);
          notification.story = `${from.fullName}${added} invite you to trip ${source.name}.`;
          notification.link = `/trip/${notification.sourceId}`;
          notification.previewImage = source.previewPhotoUrl;
        }
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
