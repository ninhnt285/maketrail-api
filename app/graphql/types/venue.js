import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLID
} from 'graphql';

const DEFAULT_IMAGE = '/noImage/noImage%s.png';
const prefix = process.env.NODE_ENV === 'production' ? 'http://api.maketrail.com/resources' : 'http://localhost:4001/resources';
const VenueType = new GraphQLObjectType({
  name: 'Venue',

  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    foursquareId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    name: {
      type: GraphQLString
    },
    address: {
      type: GraphQLString
    },
    location: {
      type: new GraphQLObjectType({
        name: 'locationVenue',
        fields: {
          lat: {
            type: GraphQLFloat
          },
          lng: {
            type: GraphQLFloat
          }
        }
      })
    },
    phone: {
      type: GraphQLString
    },
    previewPhotoUrl: {
      type: GraphQLString,
      resolve(obj) {
        return obj.previewPhotoUrl ? prefix + obj.previewPhotoUrl : prefix + DEFAULT_IMAGE;
      }
    },
  },

});

export default VenueType;
