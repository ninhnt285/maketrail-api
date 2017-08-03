import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID
} from 'graphql';

import { nodeInterface } from '../utils/nodeDefinitions';
import { PREFIX } from '../../config';

const DEFAULT_IMAGE = '/noImage/noImage%s.png';
const RequestType = new GraphQLObjectType({
  name: 'Request',

  fields: () => ({

    id: {
      type: new GraphQLNonNull(GraphQLID)
    },

    userId: {
      type: GraphQLString,
    },

    name: {
      type: GraphQLString,
    },

    link: {
      type: GraphQLString
    },

    previewImage: {
      type: GraphQLString,
      resolve(obj) {
        return obj.previewImage ? PREFIX + obj.previewImage : PREFIX + DEFAULT_IMAGE;
      }
    }

  }),

  interfaces: [nodeInterface]
});

export default RequestType;
