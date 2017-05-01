import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLList,
  GraphQLInt,
  GraphQLString
} from 'graphql';

const ICON = {
  CLEAR_DAY: 'clear-day',
  CLEAR_NIGHT: 'clear-night',
  RAIN: 'rain',
  SNOW: 'snow',
  SLEET: 'sleet',
  WIND: 'wind',
  FOG: 'fog',
  CLOUDY: 'cloudy',
  PARTLY_CLOUDY_DAY: 'partly-cloudy-day',
  PARTLY_CLOUDY_NIGHT: 'partly-cloudy-night',
  HAIL: 'hail',
  THUNDERSTORM: 'thunderstorm',
  TORNADO: 'tornado'
};

const WeatherType = new GraphQLObjectType({
  name: 'Weather',
  fields: {

    lat: {
      type: GraphQLFloat
    },

    lng: {
      type: GraphQLFloat
    },

    data: {
      type: new GraphQLList(new GraphQLObjectType({
        name: 'WeatherDaily',
        fields: {

          time: {
            type: new GraphQLNonNull(GraphQLInt)
          },

          icon: {
            type: GraphQLString
          },

          summary: {
            type: GraphQLString
          },

          temperatureMin: {
            type: GraphQLFloat
          },

          temperatureMax: {
            type: GraphQLFloat
          },

          humidity: {
            type: GraphQLFloat
          },

          windSpeed: {
            type: GraphQLFloat
          },

          visibility: {
            type: GraphQLFloat
          }
        }
      }))
    }

  },
});

export default WeatherType;
