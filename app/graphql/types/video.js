import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLFloat
} from 'graphql';
import { nodeInterface } from '../utils/nodeDefinitions';

const DEFAULT_IMAGE = '/noImage/noImage_150_square.png';
const prefix = process.env.NODE_ENV === 'production' ? 'http://api.maketrail.com/resources' : 'http://localhost:4001/resources';

const VideoType = new GraphQLObjectType({
  name: 'Video',

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
    length: {
      type: GraphQLFloat
    }
  },

  interfaces: [nodeInterface]
});

export default VideoType;
