import {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLFloat,
  GraphQLEnumType
} from 'graphql';
import { getForecast, getForecastOne } from '../../../lib/weather';
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
    },
    type: {
      type: new GraphQLEnumType({
        name: 'weatherType',
        values: {
          SINGLE_DAY: { value: 0 },
          WITH_HISTORY: { value: 1 },
        }
      })
    }
  },

  resolve: async (parentValue, { lat, lng, time, type }, { user }) => {
    if (type === 0) {
      return {
        lat,
        lng,
        data: [getForecastOne(lat, lng, time)]
      };
    }
    return getForecast(lat, lng, time);
  }
};

export default WeatherQuery;
