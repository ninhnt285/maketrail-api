import loginMutation from './authentications/login';
import registerMutation from './authentications/register';
import addTripMutation from './trip/add';
import updateTripMutation from './trip/update';
import deleteTripMutation from './trip/delete';
import addLocalityMutation from './locality/add';
import removeLocalityMutation from './locality/remove';

export default {
  login: loginMutation,
  register: registerMutation,

  addTrip: addTripMutation,
  updateTrip: updateTripMutation,
  deleteTrip: deleteTripMutation,

  addLocality: addLocalityMutation,
  removeLocality: removeLocalityMutation
};
