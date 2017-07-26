import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} from 'graphql';


const CountryType = new GraphQLObjectType({
  name: 'Country',
  fields: {

    code: {
      type: GraphQLString
    },

    status: {
      type: GraphQLInt
    }

  },
});

export default CountryType;
