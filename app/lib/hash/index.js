import bcrypt from 'bcrypt';
import { BCRYPT_SALT } from '../../config';

export function generateHash(password) {
  return bcrypt.hash(password, BCRYPT_SALT);
}

export function comparePassword(password, userPassword) {
  return bcrypt.compare(password, userPassword);
}
