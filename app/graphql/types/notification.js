import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql';

import { nodeInterface } from '../utils/nodeDefinitions';
import SubjectType from './subject';
import ObjectType from './object';
import { getNodeFromId } from '../../database/helpers/node';

const NotificationType = new GraphQLObjectType({
  name: 'Notification',

  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    from: {
      type: new GraphQLList(SubjectType),
      resolve: parentValue => parentValue.fromIds.map(fromId => getNodeFromId(fromId))
    },

    type: {
      type: GraphQLString,
      description: 'like, comment, follow, addLocality'
    },

    to: {
      type: ObjectType,
      resolve: parentValue => getNodeFromId(parentValue.toId)
    },

    sourceId: {
      type: GraphQLID
    },

  }),

  interfaces: [nodeInterface]
});

export default NotificationType;
