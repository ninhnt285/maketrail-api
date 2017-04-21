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
import { localityConnection } from '../../connections/locality';

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
    searchLocality: localityConnection,
    allTrips: tripConnection
  },

  interfaces: [nodeInterface]
});

export default ViewerType;
