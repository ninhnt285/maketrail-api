import { verifyToken } from '../../../lib/token/';

export default (req, res, next) => {
  const token = req.headers.authorization ? req.headers.authorization : req.cookies.accessToken;
  let user = null;

  try {
    // user = verifyToken(token);
    user = { id: '1630c5040000000000000000' };
  } catch (e) {
    console.log(`Invalid token! ${e}`);
    next();
    return;
  }

  // eslint-disable-next-line
  req.user = { id: user.id };

  next();
};
