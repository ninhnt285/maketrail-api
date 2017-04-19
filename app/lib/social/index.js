/**
 * Created by hoangtran on 4/19/2017.
 */
const Service = {
  FACEBOOK: {
    async getInfo(token) {
      return {
        id: '123',
        token,
        name: 'hoang',
        email: 'hehe'
      };
    }
  },

  GOOGLE: {
    async getInfo(token) {
      return {
        id: '123'
      };
    }
  },

  TWITTER: {
    async getInfo(token) {
      return {
        id: '123'
      };
    }
  },

};

export default Service;
