import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull
} from 'graphql';

import { nodeInterface } from '../utils/nodeDefinitions';

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
    },

    facebook: {
      type: new GraphQLObjectType({
        name: 'facebook',
        fields: {
          id: {
            type: GraphQLString,
          },

          name: {
            type: GraphQLString,
          },

          email: {
            type: GraphQLString,
          },

          token: {
            type: GraphQLString,
          },
        }
      })
    }
  },
  interfaces: [nodeInterface]
});

export default UserType;
