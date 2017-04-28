import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType
} from 'graphql';

import { nodeInterface } from '../../utils/nodeDefinitions';
import { tripConnection } from '../../connections/trip';
import UserService from '../../../database/helpers/user';
import UserType from '../user';
import Trip from './Trip';
import Locality from './Locality';
import TripLocality from './TripLocality';
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

    Trip,
    Locality,
    TripLocality,
    searchLocality: localityConnection,
    searchVenue: venueConnection,
    allTrips: tripConnection,
    categories: categoryConnection
  },

  interfaces: [nodeInterface]
});

export default ViewerType;
