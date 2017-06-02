import request from 'request-promise';
import VenueModel from '../models/venue';
import LocalityModel from '../models/locality';
import LocalityVenueRelationModel from '../models/localityVenueRelation';
import { FOURSQUARE_TOKEN } from '../../config';
import { getPhotoFromFoursquareId, resize } from '../../lib/google/place/photo';

const VenueService = {};

VenueService.canAddVenue = async function (user, tripLocalityId) {
  return (user && tripLocalityId);
};

VenueService.canRemoveVenue = async function (user, tripLocalityId) {
  return (user && tripLocalityId);
};

VenueService.findOneOrCreate = async function (condition, doc) {
  let venue = await VenueModel.findOne(condition);
  if (!venue) {
    const photoUri = doc.previewPhotoUrl.replace('%s', '');
    if (!await getPhotoFromFoursquareId(doc.foursquareId, photoUri)) {
      // eslint-disable-next-line no-param-reassign
      delete doc.previewPhotoUrl;
    }

    venue = await VenueModel.create(doc);
    resize(photoUri);
  }
  return venue;
};

VenueService.add = async function (user, tripLocalityId, venueId) {
  try {
    if (await this.canAddVenue(user, tripLocalityId)) {
      const res = await Promise.all([VenueModel.findById(venueId), LocalityVenueRelationModel.create({ tripLocalityId, venueId })]);
      return {
        item: {
          id: res[1].id,
          originVenue: res[0]
        }
      };
    }
    return {
      errors: ['You does not have permission to add new localityVenue.']
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal error']
    };
  }
};

VenueService.remove = async function (user, tripLocalityId, localityVenueId) {
  try {
    if (await this.canRemoveVenue(user, tripLocalityId)) {
      const tmp = await LocalityVenueRelationModel.findByIdAndRemove(localityVenueId);
      const venue = await VenueModel.findById(tmp.venueId);
      return {
        item: {
          id: localityVenueId,
          originVenue: venue
        }
      };
    }
    return {
      errors: ['You does not have permission to remove this localityVenue.']
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal error']
    };
  }
};

VenueService.getById = async function (id) {
  let item = null;
  try {
    item = await VenueModel.findById(id);
  } catch (e) {
    console.log(e);
  }
  return item;
};

VenueService.findLocalityVenueById = async function (id) {
  try {
    const tmp = await LocalityVenueRelationModel.findById(id);
    const originVenue = await VenueModel.findById(tmp.venueId);
    return {
      id,
      originVenue
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};

VenueService.getCategories = async function (venueId) {
  try {
    const tmp = await VenueModel.findById(venueId);
    if (tmp) return tmp.categories;
  } catch (e) {
    console.log(e);
    return [];
  }
};

VenueService.seachVenue = async function (localityId, query, categories) {
  try {
    const locality = await LocalityModel.findById(localityId);
    const options = {
      method: 'GET',
      uri: 'https://api.foursquare.com/v2/venues/search',
      qs: {
        oauth_token: FOURSQUARE_TOKEN,
        v: '20170428',
        query,
        limit: 10,
        categoryId: categories ? categories.join() : undefined,
        ll: `${locality.location.lat},${locality.location.lng}`
      },
      encoding: 'utf8'
    };
    const res = JSON.parse(await request(options)
      .then(ggRes => ggRes));
    const venues = res.response.venues;
    const date = new Date();
    return await Promise.all(venues.map(async (venue) => {
      const tmp = {
        foursquareId: venue.id,
        name: venue.name,
        address: venue.location ? venue.location.address : undefined,
        location: venue.location ? {
          lat: venue.location.lat,
          lng: venue.location.lng
        } : undefined,
        phone: venue.contact ? venue.contact.phone : undefined,
        price: venue.price ? venue.price.tier : undefined,
        categories: venue.categories ? venue.categories.map(r => r.name) : undefined,
        previewPhotoUrl: `/venue/${date.getUTCFullYear()}/${(date.getUTCMonth() + 1)}/${venue.id}%s.jpg`
      };
      return await this.findOneOrCreate({ foursquareId: venue.id }, tmp);
    }));
  } catch (e) {
    console.log(e);
    return [];
  }
};

VenueService.exploreVenue = async function (localityId) {
  try {
    const locality = await LocalityModel.findById(localityId);
    const options = {
      method: 'GET',
      uri: 'https://api.foursquare.com/v2/venues/explore',
      qs: {
        oauth_token: FOURSQUARE_TOKEN,
        v: '20170428',
        limit: 10,
        ll: `${locality.location.lat},${locality.location.lng}`
      },
      encoding: 'utf8'
    };
    const res = JSON.parse(await request(options)
      .then(ggRes => ggRes));
    const venues = res.response.groups[0].items;
    const date = new Date();
    return await Promise.all(venues.map(async ({ venue }) => {
      const tmp = {
        foursquareId: venue.id,
        name: venue.name,
        address: venue.location ? venue.location.address : undefined,
        location: venue.location ? {
          lat: venue.location.lat,
          lng: venue.location.lng
        } : undefined,
        phone: venue.contact ? venue.contact.phone : undefined,
        price: venue.price ? venue.price.tier : undefined,
        rating: venue.rating ? venue.rating : undefined,
        categories: venue.categories ? venue.categories.map(r => r.name) : undefined,
        previewPhotoUrl: `/venue/${date.getUTCFullYear()}/${(date.getUTCMonth() + 1)}/${venue.id}%s.jpg`
      };
      return await this.findOneOrCreate({ foursquareId: venue.id }, tmp);
    }));
  } catch (e) {
    console.log(e);
    return [];
  }
};


export default VenueService;
