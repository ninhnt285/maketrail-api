import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID
} from 'graphql';

import { nodeInterface } from '../../utils/nodeDefinitions';

const ItemType = new GraphQLObjectType({
  name: 'Item',

  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    caption: {
      type: GraphQLString
    },
    sourceUrl: {
      type: GraphQLString
    },
  },

  interfaces: [nodeInterface]
});

export default ItemType;
