import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull
} from 'graphql';

import { nodeInterface } from '../utils/nodeDefinitions';

const DEFAULT_IMAGE = '/noImage/noImage%s.png';
const prefix = process.env.NODE_ENV === 'production' ? 'http://api.maketrail.com/resources' : 'http://localhost:4001/resources';
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },

    username: {
      type: GraphQLString,
    },

    email: {
      type: GraphQLString,
    },

    fullName: {
      type: GraphQLString,
    },

    profilePicUrl: {
      type: GraphQLString,
      resolve(obj) {
        return obj.profilePicUrl ? prefix + obj.profilePicUrl : prefix + DEFAULT_IMAGE;
      }
    }

  },
  interfaces: [nodeInterface]
});

export default UserType;
