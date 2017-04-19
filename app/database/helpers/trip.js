import TripModel from '../models/trip';

const TripService = {};

TripService.canGetTrip = async function (user, tripId) {
  return (user && tripId);
};

TripService.canAddTrip = async function (user) {
  return (user);
};

TripService.add = async function (user, trip) {
  let item = null;
  try {
    if (this.canAddTrip(user)) {
      item = await TripModel.create(trip);
      return {
        item
      };
    }
    return {
      errors: ['You does not have permission to add new trip.']
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal error']
    };
  }
};

TripService.getById = async function (user, id) {
  let item = null;
  try {
    if (this.canGetTrip(user, id)) {
      item = await TripModel.findById(id);
    }
  } catch (e) {
    console.log(e);
  }
  return item;
};

export default TripService;
