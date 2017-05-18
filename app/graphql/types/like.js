import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt
} from 'graphql';
import { nodeInterface } from '../utils/nodeDefinitions';

const LikeType = new GraphQLObjectType({
  name: 'Like',

  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    fromId: {
      type: GraphQLString
    },
    parentId: {
      type: GraphQLID
    },
    createdAt: {
      type: GraphQLInt,
      resolve: parentValue => parentValue.createdAt.getTime() / 1000
    },
  },

  interfaces: [nodeInterface]
});

export default LikeType;
