import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLEnumType
} from 'graphql';

import { nodeInterface } from '../utils/nodeDefinitions';
const DEFAULT_IMAGE = '/noImage/noImage_150_square.png';
const prefix = process.env.NODE_ENV === 'production' ? 'http://api.maketrail.com/resources' : 'http://localhost:4001/resources';
const AttachmentType = new GraphQLObjectType({
  name: 'Attachment',

  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: GraphQLString
    },
    caption: {
      type: GraphQLString
    },
    previewUrl: {
      type: GraphQLString,
      resolve(obj) {
        return obj.previewUrl ? prefix + obj.previewUrl : prefix + DEFAULT_IMAGE;
      }
    },
    filePathUrl: {
      type: GraphQLString,
      resolve(obj) {
        return prefix + obj.url;
      }
    },
    type: {
      type: new GraphQLEnumType({
        name: 'attachmentType',
        values: {
          PHOTO: { value: 0 },
          VIDEO: { value: 1 }
        }
      })
    }
  },

  interfaces: [nodeInterface]
});

export default AttachmentType;
