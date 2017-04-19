import loginMutation from './authentications/login';
import registerMutation from './authentications/register';
import addTripMutation from './trip/add';

export default {
  login: loginMutation,
  register: registerMutation,

  addTrip: addTripMutation
};
