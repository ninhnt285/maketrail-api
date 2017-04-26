import loginMutation from './authentications/login';
import registerMutation from './authentications/register';
import addTripMutation from './trip/add';
import updateTripMutation from './trip/update';
import deleteTripMutation from './trip/delete';
import addTripLocalityMutation from './tripLocality/add';
import removeTripLocalityMutation from './tripLocality/remove';

export default {
  login: loginMutation,
  register: registerMutation,

  addTrip: addTripMutation,
  updateTrip: updateTripMutation,
  deleteTrip: deleteTripMutation,

  addTripLocality: addTripLocalityMutation,
  removeTripLocality: removeTripLocalityMutation
};
