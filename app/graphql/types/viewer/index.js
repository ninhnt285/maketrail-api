import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType
} from 'graphql';

import { nodeInterface } from '../../utils/nodeDefinitions';

const ViewerType = new GraphQLObjectType({
  name: 'Viewer',

  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },

  interfaces: [nodeInterface]
});

export default ViewerType;
