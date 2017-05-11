import { nodeDefinitions } from 'graphql-relay';
import { getType, Type } from '../../lib/idUtils';
import UserModel from '../../database/models/user';
import TripModel from '../../database/models/trip';
import VenueModel from '../../database/models/venue';
import CategoryModel from '../../database/models/category';
import LocalityModel from '../../database/models/locality';
import AttachmentModel from '../../database/models/attachment';
import FeedModel from '../../database/models/feed';
import LocalityService from '../../database/helpers/locality';
import VenueService from '../../database/helpers/venue';

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId, { user }) => {
    let type = 'Viewer';

    if (globalId !== 'viewer-fixed') {
      type = getType(globalId);
    }

    switch (type) {
      case Type.USER: return UserModel.findById(globalId);
      case Type.TRIP: return TripModel.findById(globalId);
      case Type.LOCALITY: return LocalityModel.findById(globalId);
      case Type.TRIP_LOCALITY: return LocalityService.findTripLocalityById(globalId);
      case Type.CATEGORY: return CategoryModel.findById(globalId);
      case Type.VENUE: return VenueModel.findById(globalId);
      case Type.LOCALITY_VENUE: return VenueService.findLocalityVenueById(globalId);
      case Type.ATTACHMENT: return AttachmentModel.findById(globalId);
      case Type.FEED: return FeedModel.findById(globalId);
      default: return {
        id: 'viewer-fixed'
      };
    }
  },
  (obj) => {
    let type = 'Viewer';
    if (obj.id !== 'viewer-fixed') {
      type = getType(obj.id || obj._id.toString()); // eslint-disable-line
    }

    switch (type) {
      /*eslint-disable */
      case Type.USER: return require('../types/user').default;
      case Type.TRIP: return require('../types/trip').default;
      case Type.LOCALITY: return require('../types/locality').default;
      case Type.TRIP_LOCALITY: return require('../types/tripLocality').default;
      case Type.CATEGORY: return require('../types/category').default;
      case Type.VENUE: return require('../types/venue').default;
      case Type.LOCALITY_VENUE: return require('../types/localityVenue').default;
      case Type.FEED: return require('../types/feed').default;
      case Type.ATTACHMENT: {
        if (obj.type === 0) {
          return require('../types/photo').default;
        }
        if (obj.type === 1) {
          return require('../types/video').default;
        }
      }
      default: return require('../types/viewer').default;
      /* eslint-enable */
    }
  }
);

export {
  nodeInterface,
  nodeField
};
