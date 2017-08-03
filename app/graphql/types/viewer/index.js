import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType,
  GraphQLInt
} from 'graphql';

import { nodeInterface } from '../../utils/nodeDefinitions';
import { tripConnection, tripExploreConnection } from '../../connections/trip';
import { userConnection, suggestUserConnection } from '../../connections/user';
import { commentConnection } from '../../connections/comment';
import { notificationConnection } from '../../connections/notification';
import { requestConnection } from '../../connections/request';
import UserService from '../../../database/helpers/user';
import FriendshipService from '../../../database/helpers/friendship';
import NotificationService from '../../../database/helpers/notification';
import UserType from '../user';
import Trip from './Trip';
import Locality from './Locality';
import TripLocality from './TripLocality';
import Weather from './Weather';
import Feed from './Feed';
import Attachment from './Attachment';
import Venue from './Venue';
import User from './User';
import { feedConnection } from '../../connections/feed';
import { localityConnection } from '../../connections/locality';
import { categoryConnection } from '../../connections/category';
import { venueConnection } from '../../connections/venue';

const ViewerType = new GraphQLObjectType({
  name: 'Viewer',

  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },

    user: {
      type: UserType,
      resolve: (parentValue, params, { user }) => {
        if (user) {
          return UserService.findById(user.id);
        }

        return null;
      }
    },

    Trip,
    Locality,
    TripLocality,
    Weather,
    Feed,
    Attachment,
    Venue,
    User,
    allFeeds: feedConnection,
    allComments: commentConnection,
    allNotifications: {
      type: new GraphQLObjectType({
        name: 'AllNotification',

        fields: () => ({
          unread: {
            type: GraphQLInt
          },
          data: notificationConnection,
        }),
      }),
      resolve: async (parentValue, params, { user }) => {
        return {
          unread: await NotificationService.countNotification(user.id)
        };
      }
    },
    allRequests: {
      type: new GraphQLObjectType({
        name: 'AllRequest',

        fields: () => ({
          unread: {
            type: GraphQLInt
          },
          data: requestConnection,
        }),
      }),
      resolve: async (parentValue, params, { user }) => {
        return {
          unread: await FriendshipService.countRequest(user.id)
        };
      }
    },
    searchUser: userConnection,
    searchTrip: tripExploreConnection,
    searchLocality: localityConnection,
    searchVenue: venueConnection,
    suggestFollows: suggestUserConnection,
    allTrips: tripConnection,
    categories: categoryConnection
  }),

  interfaces: [nodeInterface]
});

export default ViewerType;
