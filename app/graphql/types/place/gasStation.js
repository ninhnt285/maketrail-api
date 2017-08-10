import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLFloat
} from 'graphql';

import { PREFIX } from '../../../config';

const GasStationType = new GraphQLObjectType({
  name: 'GasStation',

  fields: {
    name: {
      type: GraphQLString,
      resolve(obj) {
        return obj.name;
      }
    },
    lat: {
      type: GraphQLFloat,
      resolve(obj) {
        return obj.geometry.location.lat;
      }
    },
    lng: {
      type: GraphQLFloat,
      resolve(obj) {
        return obj.geometry.location.lng;
      }
    }
  },

});

export default GasStationType;
