import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull
} from 'graphql';

import { nodeInterface } from '../../utils/nodeDefinitions';

const UserType = new GraphQLObjectType({
  name: 'UserPreview',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },

    username: {
      type: GraphQLString,
    },

    fullName: {
      type: GraphQLString,
    },

    profilePicUrl: {
      type: GraphQLString,
    },

  },
  interfaces: [nodeInterface]
});

export default UserType;
