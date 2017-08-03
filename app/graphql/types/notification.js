import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

import { nodeInterface } from '../utils/nodeDefinitions';
import SubjectType from './auxiliaryTypes/subject';
import ObjectType from './auxiliaryTypes/object';
import { getNodeFromId } from '../../database/helpers/node';
import { PREFIX } from '../../config';

const DEFAULT_IMAGE = '/noImage/noImage%s.png';
const NotificationType = new GraphQLObjectType({
  name: 'Notification',

  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    from: {
      type: SubjectType,
      resolve: parentValue => getNodeFromId(parentValue.fromId)
    },

    type: {
      type: GraphQLString,
      description: 'like, comment, follow, addLocality'
    },

    to: {
      type: ObjectType,
      resolve: parentValue => getNodeFromId(parentValue.toId)
    },

    story: {
      type: GraphQLString
    },

    link: {
      type: GraphQLString
    },

    previewImage: {
      type: GraphQLString,
      resolve(obj) {
        return obj.previewImage ? PREFIX + obj.previewImage : PREFIX + DEFAULT_IMAGE;
      }
    }

  }),

  interfaces: [nodeInterface]
});

export default NotificationType;
