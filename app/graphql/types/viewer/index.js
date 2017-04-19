import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType
} from 'graphql';

import { nodeInterface } from '../../utils/nodeDefinitions';
import UserService from '../../../database/helpers/user';
import UserType from '../user';
import Trip from './Trip';

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

    Trip
  },

  interfaces: [nodeInterface]
});

export default ViewerType;
