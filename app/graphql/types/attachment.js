import {
  GraphQLString,
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLID
} from 'graphql';

const AttachmentType = new GraphQLInterfaceType({
  name: 'Attachment',

  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: GraphQLString
    },
    caption: {
      type: GraphQLString
    },
    previewUrl: {
      type: GraphQLString,
    },
    filePathUrl: {
      type: GraphQLString,
    }
  },

  resolveType: (data) => {
    const type = data.type;
    /*eslint-disable */
    if (type === 0) {
      return require('./photo').default;
    }
    if (type === 1) {
      return require('./video').default;
    }
    /* eslint-enable */
  },

});

export default AttachmentType;
