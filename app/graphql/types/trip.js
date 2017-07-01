import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLList
} from 'graphql';

import FeedService from '../../database/helpers/feed';
import TripService from '../../database/helpers/trip';
import { nodeInterface } from '../utils/nodeDefinitions';
import { localityConnection } from '../connections/tripLocality';
import { memberConnection } from '../connections/user';
import PlaceType from './auxiliaryTypes/place';
import AttachmentType from './auxiliaryTypes/attachment';
import { PREFIX } from '../../config';
const DEFAULT_IMAGE = '/noImage/noImage%s.png';

const TripType = new GraphQLObjectType({
  name: 'Trip',

  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: GraphQLString
    },
    exportedVideo: {
      type: GraphQLBoolean
    },
    recentExportedVideo: {
      type: GraphQLString,
      resolve(obj) {
        return obj.recentExportedVideo ? PREFIX + obj.recentExportedVideo : null;
      }
    },
    isPublished: {
      type: GraphQLBoolean
    },
    isLiked: {
      type: GraphQLBoolean,
      resolve: (parentValue, params, { user }) => {
        if (user) {
          return FeedService.isLiked(user.id, parentValue.id);
        }
        return false;
      }
    },
    privacy: {
      type: new GraphQLEnumType({
        name: 'tripPrivacy',
        values: {
          PUBLIC: { value: 0 },
          PRIVATE: { value: 1 }
        }
      })
    },
    createdAt: {
      type: GraphQLInt,
      resolve: parentValue => parentValue.createdAt.getTime() / 1000
    },
    previewPhotoUrl: {
      type: GraphQLString,
      resolve(obj) {
        return obj.previewPhotoUrl ? PREFIX + obj.previewPhotoUrl : PREFIX + DEFAULT_IMAGE;
      }
    },
    localities: localityConnection,
    allAttachments: {
      type: new GraphQLList(AttachmentType),
      async resolve(obj) {
        const attachments = await TripService.getAllAttachments(obj.id);
        return attachments;
      }
    },
    allPlaces: {
      type: new GraphQLList(PlaceType),
      async resolve(obj) {
        const places = await TripService.getAllPlaces(obj.id);
        return places;
      }
    },
    members: memberConnection
  }),

  interfaces: [nodeInterface]
});

export default TripType;
