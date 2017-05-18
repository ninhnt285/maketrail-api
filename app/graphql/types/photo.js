import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt
} from 'graphql';
import { nodeInterface } from '../utils/nodeDefinitions';

const DEFAULT_IMAGE = '/noImage/noImage_150_square.png';
const prefix = process.env.NODE_ENV === 'production' ? 'http://api.maketrail.com/resources' : 'http://localhost:4001/resources';

const PhotoType = new GraphQLObjectType({
  name: 'Photo',

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
    createdAt: {
      type: GraphQLInt,
      resolve: parentValue => parentValue.createdAt.getTime() / 1000
    },
  },

  interfaces: [nodeInterface]
});

export default PhotoType;
