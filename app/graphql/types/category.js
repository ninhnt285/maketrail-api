import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLObjectType
} from 'graphql';

import { nodeInterface } from '../utils/nodeDefinitions';

const CategoryType = new GraphQLObjectType({
  name: 'Category',

  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: GraphQLString
    },
    pluralName: {
      type: GraphQLString
    },
    shortName: {
      type: GraphQLString
    },
    parentId: {
      type: GraphQLString
    }
  },

  interfaces: [nodeInterface]
});

export default CategoryType;
