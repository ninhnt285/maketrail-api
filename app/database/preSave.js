import { ObjectID } from 'mongodb';
import { genId } from '../lib/idUtils';

export default function (type) {
  return function (next) {
    try {
      /*eslint-disable */
      if (!this._id) {
        this._id = new ObjectID(genId(type));
      }
      /*eslint-begin */
    } catch(e) {
      next(e);
      return;
    }

    next();
  }
}
