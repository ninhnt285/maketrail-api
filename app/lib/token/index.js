import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config';

export function generateToken(user) {
  if (!user || !user.id) {
    throw new Error('Must provide valid user object!');
  }

  const token = jwt.sign(
    { id: user.id },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return token;
}

export function verifyToken(token) {
  if (!token) {
    throw new Error('Must provide a token!');
  }

  // NOTE: synchronous decoding
  const decoded = jwt.verify(token, JWT_SECRET);

  return decoded;
}
