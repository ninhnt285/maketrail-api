import {
  GraphQLNonNull,
  GraphQLID
} from 'graphql';
import TripType from '../trip';
import TripService from '../../../database/helpers/trip';

const TripQuery = {
  type: TripType,

  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },

  resolve: async (parentValue, { id }, { user }) => {
    const trip = await TripService.getById(user, id);
    console.log(trip);
    return trip;
  }
};

export default TripQuery;
