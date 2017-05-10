import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID
} from 'graphql';

import { nodeInterface } from '../utils/nodeDefinitions';

const prefix = process.env.NODE_ENV === 'production' ? 'http://api.maketrail.com/resources' : 'http://localhost:4001/resources';
const ItemType = new GraphQLObjectType({
  name: 'Item',

  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    caption: {
      type: GraphQLString
    },
    url: {
      type: GraphQLString,
      resolve(obj) {
        return prefix + obj.url;
      }
    },
  },

  interfaces: [nodeInterface]
});

export default ItemType;
