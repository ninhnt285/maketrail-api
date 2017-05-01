import {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLFloat
} from 'graphql';
import { getForecast } from '../../../lib/weather';
import WeatherType from '../weather';

const WeatherQuery = {
  type: WeatherType,

  args: {
    time: {
      type: GraphQLInt
    },
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },

  resolve: async (parentValue, { lat, lng, time }, { user }) => {
    return getForecast(lat, lng, time);
  }
};

export default WeatherQuery;
