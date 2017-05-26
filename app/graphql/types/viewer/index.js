import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType,
  GraphQLList
} from 'graphql';

import { nodeInterface } from '../../utils/nodeDefinitions';
import { tripConnection } from '../../connections/trip';
import { userConnection, suggestUserConnection } from '../../connections/user';
import { commentConnection } from '../../connections/comment';
import UserService from '../../../database/helpers/user';
import CountryModel from '../../../database/models/country';
import TraceModel from '../../../database/models/trace';
import UserType from '../user';
import CountryType from '../country';
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

  fields: {
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

    mapAreas: {
      type: new GraphQLList(CountryType),
      args: {
        id: {
          type: GraphQLID
        },
        userId: {
          type: GraphQLID
        }
      },
      resolve: async (parentValue, { id, userId }, { user }) => {
        if (!userId) {
          // eslint-disable-next-line no-param-reassign
          userId = user.id;
        }
        const items = await CountryModel.find({ parentId: id });
        const visiteds = await TraceModel.find({ parentId: id, userId });
        return items.map((item) => {
          for (let i=0; i < visiteds.length; i++) {
            if (item.id === visiteds[i].countryId){
              return {
                code: item.svgId,
                name: item.name,
                status: visiteds[i].status ? 2 : 1
              };
            }
          }
          return {
            code: item.svgId,
            name: item.name,
            status: 0
          };
        });
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
    searchUser: userConnection,
    searchLocality: localityConnection,
    searchVenue: venueConnection,
    suggestFollows: suggestUserConnection,
    allTrips: tripConnection,
    categories: categoryConnection
  },

  interfaces: [nodeInterface]
});

export default ViewerType;
