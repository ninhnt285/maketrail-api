import {
  GraphQLObjectType,
  GraphQLBoolean
} from 'graphql';

const RelationshipType = new GraphQLObjectType({
  name: 'Relationship',
  fields: {
    isFriend: {
      type: GraphQLBoolean
    },
    isFollow: {
      type: GraphQLBoolean
    },
    isSentRequest: {
      type: GraphQLBoolean
    }
  }
});

export default RelationshipType;
