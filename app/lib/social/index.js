/**
 * Created by hoangtran on 4/19/2017.
 */
import request from 'request-promise';
import Twit from 'twit';
import { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } from '../../config';

const Service = {
  FACEBOOK: {
    async getInfo(token) {
      const options = {
        method: 'GET',
        uri: 'https://graph.facebook.com/v2.9/me',
        qs: {
          access_token: token,
          fields: 'id, name, email'
        },
        encoding: 'utf8'
      };
      return JSON.parse(await request(options)
        .then(res => res));
    }
  },

  GOOGLE: {
    async getInfo(token) {
      const options = {
        method: 'GET',
        uri: 'https://www.googleapis.com/plus/v1/people/me',
        qs: {
          access_token: token,
        },
        encoding: 'utf8'
      };
      return await request(options).then((res) => {
        const jsonObj = JSON.parse(res);
        return {
          id: jsonObj.id,
          name: jsonObj.displayName,
          email: jsonObj.emails[0].value,
          username: jsonObj.emails[0].value.split('@')[0]
        };
      });
    }
  },

  TWITTER: {
    async getInfo(accessToken, accessTokenSecret) {
      const T = new Twit({
        consumer_key: TWITTER_CONSUMER_KEY,
        consumer_secret: TWITTER_CONSUMER_SECRET,
        access_token: accessToken,
        access_token_secret: accessTokenSecret
      });
      return await T.get('account/verify_credentials', { include_email: true }).then(res => ({
        email: res.data.email,
        id: res.data.id,
        name: res.data.name,
        username: res.data.screen_name
      }));
    }
  },

};

export default Service;
