/**
 * Created by hoangtran on 4/19/2017.
 */
import request from 'request-promise';

const userFieldSet = 'id, name, email';
const Service = {
  FACEBOOK: {
    async getInfo(token) {
      const options = {
        method: 'GET',
        uri: 'https://graph.facebook.com/v2.9/me',
        qs: {
          access_token: token,
          fields: userFieldSet
        },
        encoding: 'utf8'
      };
      return JSON.parse(await request(options)
        .then(fbRes => fbRes));
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
