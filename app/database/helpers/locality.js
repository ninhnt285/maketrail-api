import LocalityModel from '../models/locality';
import TripLocalityRelationModel from '../models/tripLocalityRelation';

const LocalityService = {};

LocalityService.canAddLocality = async function (user, tripId) {
  return (user && tripId);
};

LocalityService.findOneOrCreate = async function (condition, doc) {
  let user = await LocalityModel.findOne(condition);
  if (!user) {
    user = await LocalityModel.create(doc);
  }
  return user;
};

LocalityService.add = async function (user, tripId, locality) {
  let item = null;
  try {
    if (this.canAddLocality(user, tripId)) {
      item = await this.findOneOrCreate({ googlePlaceId: locality.googlePlaceId }, locality);
      await TripLocalityRelationModel.create({ tripId, localityId: item.id });
      return {
        item
      };
    }
    return {
      errors: ['You does not have permission to add new locality.']
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal error']
    };
  }
};

LocalityService.getById = async function (id) {
  let item = null;
  try {
    item = await LocalityModel.findById(id);
  } catch (e) {
    console.log(e);
  }
  return item;
};

export default LocalityService;
