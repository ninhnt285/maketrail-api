import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLID,
  GraphQLEnumType
} from 'graphql';
import { PREFIX } from '../../config';

const DEFAULT_IMAGE = '/noImage/noImage%s.png';
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
    price: {
      type: new GraphQLEnumType({
        name: 'venuePrice',
        values: {
          VERY_CHEAP: { value: 1 },
          CHEAP: { value: 2 },
          AFFORDABLE: { value: 3 },
          EXPENSIVE: { value: 4 }
        }
      })
    },
    rating: {
      type: GraphQLFloat
    },
    previewPhotoUrl: {
      type: GraphQLString,
      resolve(obj) {
        return obj.previewPhotoUrl ? PREFIX + obj.previewPhotoUrl : PREFIX + DEFAULT_IMAGE;
      }
    },
  },

});

export default VenueType;
