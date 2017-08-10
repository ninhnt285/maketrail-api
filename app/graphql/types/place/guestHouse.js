import {
  GraphQLString,
  GraphQLObjectType
} from 'graphql';

import { PREFIX } from '../../../config';

const GuestHouseType = new GraphQLObjectType({
  name: 'GuestHouse',

  fields: {
    name: {
      type: GraphQLString,
      resolve(obj) {
        return obj.listing.name;
      }
    },
    room_type: {
      type: GraphQLString,
      resolve(obj) {
        return obj.listing.room_type_category;
      }
    },
    address: {
      type: GraphQLString,
      resolve(obj) {
        return obj.listing.public_address;
      }
    },
    price: {
      type: GraphQLString,
      resolve(obj) {
        return obj.pricing_quote.rate.amount_formatted;
      }
    },
    previewPhotoUrl: {
      type: GraphQLString,
      resolve(obj) {
        return obj.listing.picture_url;
      }
    },
    url: {
      type: GraphQLString,
      resolve(obj) {
        return `https://www.airbnb.com/rooms/${obj.listing.id}`;
      }
    }
  },

});

export default GuestHouseType;
